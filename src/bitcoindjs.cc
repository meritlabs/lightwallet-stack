/**
 * bitcoind.js - a binding for node.js which links to libbitcoind.so/dylib.
 * Copyright (c) 2015, BitPay (MIT License)
 *
 * bitcoindjs.cc:
 *   A bitcoind node.js binding.
 */

#include "bitcoindjs.h"

using namespace std;
using namespace boost;
using namespace node;
using namespace v8;

/**
 * Bitcoin Globals
 */

// These global functions and variables are
// required to be defined/exposed here.

extern void WaitForShutdown(boost::thread_group* threadGroup);
static termios orig_termios;
extern CTxMemPool mempool;

/**
 * Node.js Internal Function Templates
 */

static void
async_start_node(uv_work_t *req);

static void
async_start_node_after(uv_work_t *req);

static void
async_blocks_ready(uv_work_t *req);

static void
async_blocks_ready_after(uv_work_t *req);

static void
async_stop_node(uv_work_t *req);

static void
async_stop_node_after(uv_work_t *req);

static int
start_node(void);

static void
start_node_thread(void);

static void
async_get_block(uv_work_t *req);

static void
async_get_block_after(uv_work_t *req);

static void
async_get_tx(uv_work_t *req);

static void
async_get_tx_after(uv_work_t *req);

static int
get_tx(uint256 txid, uint256& blockhash, CTransaction& ctx);

extern "C" void
init(Handle<Object>);

/**
 * Private Global Variables
 * Used only by bitcoindjs functions.
 */

static volatile bool shutdown_complete = false;
static char *g_data_dir = NULL;
static bool g_rpc = false;
static bool g_testnet = false;
static bool g_txindex = false;

/**
 * Private Structs
 * Used for async functions and necessary linked lists at points.
 */

/**
 * async_node_data
 * Where the uv async request data resides.
 */

struct async_block_ready_data {
  std::string err_msg;
  std::string result;
  Eternal<Function> callback;
};

/**
 * async_node_data
 * Where the uv async request data resides.
 */

struct async_node_data {
  std::string err_msg;
  std::string result;
  std::string datadir;
  bool rpc;
  bool testnet;
  bool txindex;
  Eternal<Function> callback;
};

/**
 * async_block_data
 */

struct async_block_data {
  std::string err_msg;
  std::string hash;
  int64_t height;
  char* buffer;
  uint32_t size;
  CBlock cblock;
  CBlockIndex* cblock_index;
  Eternal<Function> callback;
};

/**
 * async_tx_data
 */

struct async_tx_data {
  std::string err_msg;
  std::string txid;
  std::string blockhash;
  CTransaction ctx;
  Eternal<Function> callback;
};

/**
 * async_block_tx_data
 */

struct async_block_tx_data {
  std::string err_msg;
  std::string txid;
  CBlock cblock;
  CBlockIndex* cblock_index;
  CTransaction ctx;
  Eternal<Function> callback;
};

/**
 * async_block_time_data
 */

typedef struct _cblocks_list {
  CBlock cblock;
  CBlockIndex* cblock_index;
  struct _cblocks_list *next;
  std::string err_msg;
} cblocks_list;

struct async_block_time_data {
  std::string err_msg;
  uint32_t gte;
  uint32_t lte;
  int64_t limit;
  cblocks_list *cblocks;
  Eternal<Function> callback;
};

/**
 * async_addrtx_data
 */

typedef struct _ctx_list {
  CTransaction ctx;
  uint256 blockhash;
  struct _ctx_list *next;
  std::string err_msg;
} ctx_list;

struct async_addrtx_data {
  std::string err_msg;
  std::string addr;
  ctx_list *ctxs;
  int64_t blockheight;
  int64_t blocktime;
  Eternal<Function> callback;
};

/**
 * async_broadcast_tx_data
 */

struct async_broadcast_tx_data {
  std::string err_msg;
  Eternal<Object> jstx;
  CTransaction ctx;
  std::string txid;
  bool override_fees;
  bool own_only;
  Eternal<Function> callback;
};

/**
 * async_from_tx_data
 */

struct async_from_tx_data {
  std::string err_msg;
  std::string txid;
  ctx_list *ctxs;
  Eternal<Function> callback;
};

/**
 * Helpers
 */

static bool
set_cooked(void);

/**
 * Functions
 */

NAN_METHOD(OnBlocksReady) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);

  Local<Function> callback;
  callback = Local<Function>::Cast(args[0]);

  async_block_ready_data *data = new async_block_ready_data();
  data->err_msg = std::string("");
  data->result = std::string("");

  Eternal<Function> eternal(isolate, callback);

  data->callback = eternal;
  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_blocks_ready,
    (uv_after_work_cb)async_blocks_ready_after);

  assert(status == 0);

  NanReturnValue(Undefined(isolate));

}

/**
 * async_start_node()
 * Call start_node() and start all our boost threads.
 */

static void
async_blocks_ready(uv_work_t *req) {
  async_block_ready_data *data = static_cast<async_block_ready_data*>(req->data);
  data->result = std::string("");

  while(!chainActive.Tip()) {
    usleep(1E6);
  }

  CBlockIndex* tip = chainActive.Tip();
  uint256 tipHash = tip->GetBlockHash();

  while(mapBlockIndex.count(tipHash) == 0) {
    usleep(1E6);
  }

}

static void
async_blocks_ready_after(uv_work_t *req) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  async_block_ready_data *data = static_cast<async_block_ready_data*>(req->data);

  Local<Function> cb = data->callback.Get(isolate);
  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
     v8::Null(isolate),
     Local<Value>::New(isolate, NanNew<String>(data->result))
    };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  delete data;
  delete req;
}

/**
 * StartBitcoind()
 * bitcoind.start(callback)
 * Start the bitcoind node with AppInit2() on a separate thread.
 */

NAN_METHOD(StartBitcoind) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);

  Local<Function> callback;
  std::string datadir = std::string("");
  bool rpc = false;
  bool testnet = false;
  bool txindex = false;

  if (args.Length() >= 2 && args[0]->IsObject() && args[1]->IsFunction()) {
    Local<Object> options = Local<Object>::Cast(args[0]);
    if (options->Get(NanNew<String>("datadir"))->IsString()) {
      String::Utf8Value datadir_(options->Get(NanNew<String>("datadir"))->ToString());
      datadir = std::string(*datadir_);
    }
    if (options->Get(NanNew<String>("rpc"))->IsBoolean()) {
      rpc = options->Get(NanNew<String>("rpc"))->ToBoolean()->IsTrue();
    }
    if (options->Get(NanNew<String>("testnet"))->IsBoolean()) {
      testnet = options->Get(NanNew<String>("testnet"))->ToBoolean()->IsTrue();
    }
    if (options->Get(NanNew<String>("txindex"))->IsBoolean()) {
      txindex = options->Get(NanNew<String>("txindex"))->ToBoolean()->IsTrue();
    }
    callback = Local<Function>::Cast(args[1]);
  } else if (args.Length() >= 2
             && (args[0]->IsUndefined() || args[0]->IsNull())
             && args[1]->IsFunction()) {
    callback = Local<Function>::Cast(args[1]);
  } else if (args.Length() >= 1 && args[0]->IsFunction()) {
    callback = Local<Function>::Cast(args[0]);
  } else {
    return NanThrowError(
      "Usage: bitcoind.start(callback)");
  }

  //
  // Run bitcoind's StartNode() on a separate thread.
  //

  async_node_data *data = new async_node_data();
  data->err_msg = std::string("");
  data->result = std::string("");
  data->datadir = datadir;
  data->rpc = rpc;
  data->testnet = testnet;
  data->txindex = txindex;

  Eternal<Function> eternal(isolate, callback);

  data->callback = eternal;
  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_start_node,
    (uv_after_work_cb)async_start_node_after);

  assert(status == 0);

  NanReturnValue(Undefined(isolate));
}

/**
 * async_start_node()
 * Call start_node() and start all our boost threads.
 */

static void
async_start_node(uv_work_t *req) {
  async_node_data *data = static_cast<async_node_data*>(req->data);
  if (data->datadir != "") {
    g_data_dir = (char *)data->datadir.c_str();
  } else {
    g_data_dir = (char *)malloc(sizeof(char) * 512);
    snprintf(g_data_dir, sizeof(char) * 512, "%s/.bitcoind.js", getenv("HOME"));
  }
  g_rpc = (bool)data->rpc;
  g_testnet = (bool)data->testnet;
  g_txindex = (bool)data->txindex;
  tcgetattr(STDIN_FILENO, &orig_termios);
  start_node();
  data->result = std::string("bitcoind opened.");
}

/**
 * async_start_node_after()
 * Execute our callback.
 */

static void
async_start_node_after(uv_work_t *req) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  async_node_data *data = static_cast<async_node_data*>(req->data);

  Local<Function> cb = data->callback.Get(isolate);
  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
     v8::Null(isolate),
     Local<Value>::New(isolate, NanNew<String>(data->result))
    };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  delete data;
  delete req;
}

/**
 * start_node(void)
 * Start AppInit2() on a separate thread, wait for
 * Unfortunately, we need to wait for the initialization
 * to unhook the signal handlers so we can use them
 * from node.js in javascript.
 */

static int
start_node(void) {
  SetupEnvironment();

  noui_connect();

  new boost::thread(boost::bind(&start_node_thread));

  // Drop the bitcoind signal handlers: we want our own.
  signal(SIGINT, SIG_DFL);
  signal(SIGHUP, SIG_DFL);
  signal(SIGQUIT, SIG_DFL);

  return 0;
}

static void
start_node_thread(void) {
  boost::thread_group threadGroup;
  CScheduler scheduler;

  // Workaround for AppInit2() arg parsing. Not ideal, but it works.
  int argc = 0;
  char **argv = (char **)malloc((4 + 1) * sizeof(char **));

  argv[argc] = (char *)"bitcoind";
  argc++;

  if (g_data_dir) {
    const int argl = 9 + strlen(g_data_dir) + 1;
    char *arg = (char *)malloc(sizeof(char) * argl);
    int w = snprintf(arg, argl, "-datadir=%s", g_data_dir);
    if (w >= 10 && w <= argl) {
      arg[w] = '\0';
      argv[argc] = arg;
      argc++;
    } else {
      if (set_cooked()) {
        fprintf(stderr, "bitcoind.js: Bad -datadir value.\n");
      }
    }
  }

  if (g_rpc) {
    argv[argc] = (char *)"-server";
    argc++;
  }

  if (g_testnet) {
    argv[argc] = (char *)"-testnet";
    argc++;
  }

  if (g_txindex) {
    argv[argc] = (char *)"-txindex";
    argc++;
  }

  argv[argc] = NULL;

  bool fRet = false;
  try {
    ParseParameters((const int)argc, (const char **)argv);

    if (!boost::filesystem::is_directory(GetDataDir(false))) {
      if (set_cooked()) {
        fprintf(stderr,
          "bitcoind.js: Specified data directory \"%s\" does not exist.\n",
          mapArgs["-datadir"].c_str());
      }
      shutdown_complete = true;
      _exit(1);
      return;
    }

    try {
      ReadConfigFile(mapArgs, mapMultiArgs);
    } catch(std::exception &e) {
      if (set_cooked()) {
        fprintf(stderr,
          "bitcoind.js: Error reading configuration file: %s\n", e.what());
      }
      shutdown_complete = true;
      _exit(1);
      return;
    }

    if (!SelectParamsFromCommandLine()) {
      if (set_cooked()) {
        fprintf(stderr,
          "bitcoind.js: Invalid combination of -regtest and -testnet.\n");
      }
      shutdown_complete = true;
      _exit(1);
      return;
    }

    CreatePidFile(GetPidFile(), getpid());

    fRet = AppInit2(threadGroup, scheduler);

  } catch (std::exception& e) {
     if (set_cooked()) {
       fprintf(stderr, "bitcoind.js: AppInit2(): std::exception\n");
     }
  } catch (...) {
    if (set_cooked()) {
      fprintf(stderr, "bitcoind.js: AppInit2(): other exception\n");
    }
  }

  if (!fRet)
  {
          threadGroup.interrupt_all();
  } else {
          WaitForShutdown(&threadGroup);
  }
  Shutdown();
  shutdown_complete = true;

}

/**
 * StopBitcoind()
 * bitcoind.stop(callback)
 */

NAN_METHOD(StopBitcoind) {
  fprintf(stderr, "Stopping Bitcoind please wait!\n");
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);

  if (args.Length() < 1 || !args[0]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoind.stop(callback)");
  }

  Local<Function> callback = Local<Function>::Cast(args[0]);

  //
  // Run bitcoind's StartShutdown() on a separate thread.
  //

  async_node_data *data = new async_node_data();
  data->err_msg = std::string("");
  data->result = std::string("");
  Eternal<Function> eternal(isolate, callback);
  data->callback = eternal;

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_stop_node,
    (uv_after_work_cb)async_stop_node_after);

  assert(status == 0);
  NanReturnValue(Undefined(isolate));

}

/**
 * async_stop_node()
 * Call StartShutdown() to join the boost threads, which will call Shutdown()
 * and set shutdown_complete to true to notify the main node.js thread.
 */

static void
async_stop_node(uv_work_t *req) {
  async_node_data *data = static_cast<async_node_data*>(req->data);
  StartShutdown();
  while(!shutdown_complete) {
    usleep(1E6);
  }
  data->result = std::string("bitcoind shutdown.");
}

/**
 * async_stop_node_after()
 * Execute our callback.
 */

static void
async_stop_node_after(uv_work_t *req) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  async_node_data* data = static_cast<async_node_data*>(req->data);

  Local<Function> cb = data->callback.Get(isolate);
  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(isolate, NanNull()),
      Local<Value>::New(isolate, NanNew<String>(data->result))
    };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  delete data;
  delete req;
}

/**
 * IsStopping()
 * bitcoind.stopping()
 * Check whether bitcoind is in the process of shutting down. This is polled
 * from javascript.
 */

NAN_METHOD(IsStopping) {
  NanScope();
  NanReturnValue(NanNew<Boolean>(ShutdownRequested()));
}

/**
 * IsStopped()
 * bitcoind.stopped()
 * Check whether bitcoind has shutdown completely. This will be polled by
 * javascript to check whether the libuv event loop is safe to stop.
 */

NAN_METHOD(IsStopped) {
  NanScope();
  NanReturnValue(NanNew<Boolean>(shutdown_complete));
}

/**
 * GetBlock()
 * bitcoind.getBlock([blockhash,blockheight], callback)
 * Read any block from disk asynchronously.
 */

NAN_METHOD(GetBlock) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  if (args.Length() < 2
      || (!args[0]->IsString() && !args[0]->IsNumber())
      || !args[1]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.getBlock([blockhash,blockheight], callback)");
  }

  async_block_data *data = new async_block_data();

  if (args[0]->IsNumber()) {
    int64_t height = args[0]->IntegerValue();
    data->err_msg = std::string("");
    data->hash = std::string("");
    data->height = height;
  } else {
    String::Utf8Value hash_(args[0]->ToString());
    std::string hash = std::string(*hash_);
    data->err_msg = std::string("");
    data->hash = hash;
    data->height = -1;
  }

  Local<Function> callback = Local<Function>::Cast(args[1]);
  Eternal<Function> eternal(isolate, callback);
  data->callback = eternal;

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_get_block,
    (uv_after_work_cb)async_get_block_after);

  assert(status == 0);

  NanReturnValue(Undefined(isolate));
}

static void
async_get_block(uv_work_t *req) {
  async_block_data* data = static_cast<async_block_data*>(req->data);

  CBlockIndex* pblockindex;
  uint256 hash = uint256S(data->hash);

  if (data->height != -1) {
    pblockindex = chainActive[data->height];
    if (pblockindex == NULL) {
      data->err_msg = std::string("Block not found.");
      return;
    }
  } else {
    if (mapBlockIndex.count(hash) == 0) {
      data->err_msg = std::string("Block not found.");
      return;
    } else {
      pblockindex = mapBlockIndex[hash];
    }
  }

  const CDiskBlockPos& pos = pblockindex->GetBlockPos();

  // We can read directly from the file, and pass that, we don't need to
  // deserialize the entire block only for it to then be serialized
  // and then deserialized again in JavaScript

  // Open history file to read
  CAutoFile filein(OpenBlockFile(pos, true), SER_DISK, CLIENT_VERSION);
  if (filein.IsNull()) {
    data->err_msg = std::string("ReadBlockFromDisk: OpenBlockFile failed");
    return;
  }

  // Get the actual file, seeked position and rewind a uint32_t
  FILE* blockFile = filein.release();
  long int filePos = ftell(blockFile);
  fseek(blockFile, filePos - sizeof(uint32_t), SEEK_SET);

  // Read the size of the block
  uint32_t size = 0;
  fread(&size, sizeof(uint32_t), 1, blockFile);

  // Read block
  char* buffer = (char *)malloc(sizeof(char) * size);
  fread((void *)buffer, sizeof(char), size, blockFile);
  fclose(blockFile);

  data->buffer = buffer;
  data->size = size;
  data->cblock_index = pblockindex;

}

static void
async_get_block_after(uv_work_t *req) {
  Isolate *isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  async_block_data* data = static_cast<async_block_data*>(req->data);
  Local<Function> cb = data->callback.Get(isolate);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {

    Local<Value> rawNodeBuffer = node::Buffer::New(isolate, data->buffer, data->size);

    delete data->buffer;
    data->buffer = NULL;

    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(isolate, NanNull()),
      rawNodeBuffer
    };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  delete data;
  delete req;
}

/**
 * GetTransaction()
 * bitcoind.getTransaction(txid, [blockhash], callback)
 * Read any transaction from disk asynchronously.
 */

NAN_METHOD(GetTransaction) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  if (args.Length() < 3
      || !args[0]->IsString()
      || !args[1]->IsString()
      || !args[2]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.getTransaction(txid, [blockhash], callback)");
  }

  String::Utf8Value txid_(args[0]->ToString());
  String::Utf8Value blockhash_(args[1]->ToString());
  Local<Function> callback = Local<Function>::Cast(args[2]);

  async_tx_data *data = new async_tx_data();

  data->err_msg = std::string("");
  data->txid = std::string("");

  std::string txid = std::string(*txid_);
  std::string blockhash = std::string(*blockhash_);

  data->txid = txid;
  Eternal<Function> eternal(isolate, callback);
  data->callback = eternal;

  if (blockhash == "") {
    data->blockhash = uint256().GetHex();
  }

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_get_tx,
    (uv_after_work_cb)async_get_tx_after);

  assert(status == 0);

  NanReturnValue(Undefined(isolate));
}

static void
async_get_tx(uv_work_t *req) {
  async_tx_data* data = static_cast<async_tx_data*>(req->data);

  uint256 hash = uint256S(data->txid);
  uint256 blockhash;
  CTransaction ctx;
  
  if (!GetTransaction(hash, ctx, blockhash, true)) {
    data->err_msg = std::string("Transaction not found.");
  } else {
    data->ctx = ctx;
    data->blockhash = blockhash.GetHex();
  }

}

static void
async_get_tx_after(uv_work_t *req) {
  Isolate* isolate = Isolate::GetCurrent();
  HandleScope scope(isolate);
  async_tx_data* data = static_cast<async_tx_data*>(req->data);

  CTransaction ctx = data->ctx;
  Local<Function> cb = data->callback.Get(isolate);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {

    CDataStream ssTx(SER_NETWORK, PROTOCOL_VERSION);
    ssTx << ctx;
    std::string stx = ssTx.str();
    Local<Value> rawNodeBuffer = node::Buffer::New(isolate, stx.c_str(), stx.size());
    
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(isolate, NanNull()),
      rawNodeBuffer
    };
    TryCatch try_catch;
    cb->Call(isolate->GetCurrentContext()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }
  delete data;
  delete req;
}

/**
 * IsSpent()
 * bitcoindjs.isSpent()
 * Determine if an outpoint is spent
 */
NAN_METHOD(IsSpent) {
  NanScope();

  if (args.Length() > 2) {
    return NanThrowError(
      "Usage: bitcoindjs.isSpent(txid, outputIndex)");
  }

  String::Utf8Value arg(args[0]->ToString());
  std::string argStr = std::string(*arg);
  const uint256 txid = uint256S(argStr);
  int outputIndex = args[1]->IntegerValue();

  CCoinsView dummy;
  CCoinsViewCache view(&dummy);

  CCoinsViewMemPool viewMemPool(pcoinsTip, mempool);
  view.SetBackend(viewMemPool);

  if (view.HaveCoins(txid)) {
    const CCoins* coins = view.AccessCoins(txid);
    if (coins && coins->IsAvailable(outputIndex)) {
      NanReturnValue(NanNew<Boolean>(false));
      return;
    }
  }
  NanReturnValue(NanNew<Boolean>(true));
};

/**
 * GetInfo()
 * bitcoindjs.getInfo()
 * Get miscellaneous information
 */

NAN_METHOD(GetInfo) {
  NanScope();

  if (args.Length() > 0) {
    return NanThrowError(
      "Usage: bitcoindjs.getInfo()");
  }

  Local<Object> obj = NanNew<Object>();

  proxyType proxy;
  GetProxy(NET_IPV4, proxy);

  obj->Set(NanNew<String>("version"), NanNew<Number>(CLIENT_VERSION));
  obj->Set(NanNew<String>("protocolversion"), NanNew<Number>(PROTOCOL_VERSION));
  obj->Set(NanNew<String>("blocks"), NanNew<Number>((int)chainActive.Height())->ToInt32());
  obj->Set(NanNew<String>("timeoffset"), NanNew<Number>(GetTimeOffset()));
  obj->Set(NanNew<String>("connections"), NanNew<Number>((int)vNodes.size())->ToInt32());
  obj->Set(NanNew<String>("difficulty"), NanNew<Number>((double)GetDifficulty()));
  obj->Set(NanNew<String>("testnet"), NanNew<Boolean>(Params().NetworkIDString() == "test"));
  obj->Set(NanNew<String>("relayfee"), NanNew<Number>(::minRelayTxFee.GetFeePerK())); // double
  obj->Set(NanNew<String>("errors"), NanNew<String>(GetWarnings("statusbar")));

  NanReturnValue(obj);
}

/**
 * Helpers
 */

static bool
set_cooked(void) {
  uv_tty_t tty;
  tty.mode = 1;
  tty.orig_termios = orig_termios;

  if (!uv_tty_set_mode(&tty, 0)) {
    printf("\x1b[H\x1b[J");
    return true;
  }

  return false;
}

/**
 * Init()
 * Initialize the singleton object known as bitcoindjs.
 */

extern "C" void
init(Handle<Object> target) {
  NanScope();

  NODE_SET_METHOD(target, "start", StartBitcoind);
  NODE_SET_METHOD(target, "onBlocksReady", OnBlocksReady);
  NODE_SET_METHOD(target, "stop", StopBitcoind);
  NODE_SET_METHOD(target, "stopping", IsStopping);
  NODE_SET_METHOD(target, "stopped", IsStopped);
  NODE_SET_METHOD(target, "getBlock", GetBlock);
  NODE_SET_METHOD(target, "getTransaction", GetTransaction);
  NODE_SET_METHOD(target, "getInfo", GetInfo);
  NODE_SET_METHOD(target, "isSpent", IsSpent);

}

NODE_MODULE(bitcoindjs, init)
