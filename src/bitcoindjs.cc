/**
 * bitcoind.js - a binding for node.js which links to libbitcoind.so.
 * Copyright (c) 2014, BitPay (MIT License)
 *
 * bitcoindjs.cc:
 *   A bitcoind node.js binding.
 */

#include "nan.h"

#include "bitcoindjs.h"

/**
 * LevelDB
 */

#include <leveldb/cache.h>
#include <leveldb/options.h>
#include <leveldb/env.h>
#include <leveldb/filter_policy.h>
#include <memenv.h>
#include <leveldb/db.h>
#include <leveldb/write_batch.h>
#include <leveldb/comparator.h>

/**
 * Bitcoin headers
 */

#include "config/bitcoin-config.h"

#include "addrman.h"
#include "alert.h"
#include "allocators.h"
#include "amount.h"
#include "base58.h"
#include "bloom.h"
#include "bitcoind.h"
#include "chain.h"
#include "chainparams.h"
#include "chainparamsbase.h"
#include "checkpoints.h"
#include "checkqueue.h"
#include "clientversion.h"
#include "coincontrol.h"
#include "coins.h"
#include "compat.h"
#include "core.h"
#include "core_io.h"
#include "crypter.h"
#include "db.h"
#include "hash.h"
#include "init.h"
#include "key.h"
#include "keystore.h"
#include "leveldbwrapper.h"
#include "limitedmap.h"
#include "main.h"
#include "miner.h"
#include "mruset.h"
#include "netbase.h"
#include "net.h"
#include "noui.h"
#include "pow.h"
#include "protocol.h"
#include "random.h"
#include "rpcclient.h"
#include "rpcprotocol.h"
#include "rpcserver.h"
#include "rpcwallet.h"
#include "script/compressor.h"
#include "script/interpreter.h"
#include "script/script.h"
#include "script/sigcache.h"
#include "script/sign.h"
#include "script/standard.h"
#include "serialize.h"
#include "sync.h"
#include "threadsafety.h"
#include "timedata.h"
#include "tinyformat.h"
#include "txdb.h"
#include "txmempool.h"
#include "ui_interface.h"
#include "uint256.h"
#include "util.h"
#include "utilstrencodings.h"
#include "utilmoneystr.h"
#include "utiltime.h"
#include "version.h"
#include "wallet.h"
#include "wallet_ismine.h"
#include "walletdb.h"
#include "compat/sanity.h"

#include "json/json_spirit.h"
#include "json/json_spirit_error_position.h"
#include "json/json_spirit_reader.h"
#include "json/json_spirit_reader_template.h"
#include "json/json_spirit_stream_reader.h"
#include "json/json_spirit_utils.h"
#include "json/json_spirit_value.h"
#include "json/json_spirit_writer.h"
#include "json/json_spirit_writer_template.h"

#include "crypto/common.h"
#include "crypto/sha2.h"
#include "crypto/sha1.h"
#include "crypto/ripemd160.h"

#include "univalue/univalue_escapes.h"
#include "univalue/univalue.h"

/**
 * Bitcoin System
 */

#include <stdint.h>
#include <signal.h>
#include <stdio.h>

#include <fstream>

#include <boost/algorithm/string/predicate.hpp>
#include <boost/filesystem.hpp>
#include <boost/interprocess/sync/file_lock.hpp>
#include <boost/algorithm/string.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>

#include <openssl/crypto.h>

using namespace std;
using namespace boost;

/**
 * Bitcoin Globals
 */

// These global functions and variables are
// required to be defined/exposed here.

extern void DetectShutdownThread(boost::thread_group*);
extern int nScriptCheckThreads;
extern std::map<std::string, std::string> mapArgs;
#ifdef ENABLE_WALLET
extern std::string strWalletFile;
extern CWallet *pwalletMain;
#endif
extern CFeeRate payTxFee;
extern const std::string strMessageMagic;

// XXX May not link properly: some functions here are static (rpcdump.cpp):
// extern std::string EncodeDumpTime(int64_t nTime);
// extern int64_t DecodeDumpTime(const std::string &str);
// extern std::string EncodeDumpString(const std::string &str);
// extern std::string DecodeDumpString(const std::string &str);

static std::string
EncodeDumpTime(int64_t nTime) {
  return DateTimeStrFormat("%Y-%m-%dT%H:%M:%SZ", nTime);
}

static int64_t
DecodeDumpTime(const std::string &str) {
  static const boost::posix_time::ptime epoch = boost::posix_time::from_time_t(0);
  static const std::locale loc(std::locale::classic(),
    new boost::posix_time::time_input_facet("%Y-%m-%dT%H:%M:%SZ"));
  std::istringstream iss(str);
  iss.imbue(loc);
  boost::posix_time::ptime ptime(boost::date_time::not_a_date_time);
  iss >> ptime;
  if (ptime.is_not_a_date_time()) {
    return 0;
  }
  return (ptime - epoch).total_seconds();
}

static std::string
EncodeDumpString(const std::string &str) {
  std::stringstream ret;
  BOOST_FOREACH(unsigned char c, str) {
    if (c <= 32 || c >= 128 || c == '%') {
      ret << '%' << HexStr(&c, &c + 1);
    } else {
      ret << c;
    }
  }
  return ret.str();
}

// May not need this - not static:
#if 0
static std::string
DecodeDumpString(const std::string &str) {
  std::stringstream ret;
  for (unsigned int pos = 0; pos < str.length(); pos++) {
      unsigned char c = str[pos];
    if (c == '%' && pos+2 < str.length()) {
      c = (((str[pos+1]>>6)*9+((str[pos+1]-'0')&15)) << 4) |
          ((str[pos+2]>>6)*9+((str[pos+2]-'0')&15));
      pos += 2;
    }
    ret << c;
  }
  return ret.str();
}
#else
extern std::string DecodeDumpString(const std::string &str);
#endif

/**
 * Node.js System
 */

#include <node.h>
#include <string>

#include <string.h>
#include <stdlib.h>
#include <unistd.h>

#include <sys/types.h>
#include <sys/stat.h>
#include <sys/ioctl.h>
#include <fcntl.h>

using namespace node;
using namespace v8;

#define EMPTY ("\\x01")

/**
 * Node.js Exposed Function Templates
 */

NAN_METHOD(StartBitcoind);
NAN_METHOD(IsStopping);
NAN_METHOD(IsStopped);
NAN_METHOD(StopBitcoind);
NAN_METHOD(GetBlock);
NAN_METHOD(GetTx);
NAN_METHOD(BroadcastTx);
NAN_METHOD(VerifyBlock);
NAN_METHOD(VerifyTransaction);
NAN_METHOD(FillTransaction);
NAN_METHOD(GetInfo);
NAN_METHOD(GetPeerInfo);
NAN_METHOD(GetAddresses);
NAN_METHOD(GetProgress);
NAN_METHOD(SetGenerate);
NAN_METHOD(GetGenerate);
NAN_METHOD(GetMiningInfo);
NAN_METHOD(GetAddrTransactions);
NAN_METHOD(GetBestBlock);

NAN_METHOD(GetBlockHex);
NAN_METHOD(GetTxHex);
NAN_METHOD(BlockFromHex);
NAN_METHOD(TxFromHex);
NAN_METHOD(HookPackets);

NAN_METHOD(WalletNewAddress);
NAN_METHOD(WalletGetAccountAddress);
NAN_METHOD(WalletSetAccount);
NAN_METHOD(WalletGetAccount);
NAN_METHOD(WalletGetRecipients);
NAN_METHOD(WalletSetRecipient);
NAN_METHOD(WalletRemoveRecipient);
NAN_METHOD(WalletSendTo);
NAN_METHOD(WalletSignMessage);
NAN_METHOD(WalletVerifyMessage);
NAN_METHOD(WalletGetBalance);
NAN_METHOD(WalletCreateMultiSigAddress);
NAN_METHOD(WalletGetUnconfirmedBalance);
NAN_METHOD(WalletSendFrom);
NAN_METHOD(WalletMove);
NAN_METHOD(WalletListTransactions);
NAN_METHOD(WalletReceivedByAddress);
NAN_METHOD(WalletListAccounts);
NAN_METHOD(WalletGetTransaction);
NAN_METHOD(WalletBackup);
NAN_METHOD(WalletPassphrase);
NAN_METHOD(WalletPassphraseChange);
NAN_METHOD(WalletLock);
NAN_METHOD(WalletEncrypt);
NAN_METHOD(WalletEncrypted);
NAN_METHOD(WalletKeyPoolRefill);
NAN_METHOD(WalletSetTxFee);
NAN_METHOD(WalletDumpKey);
NAN_METHOD(WalletImportKey);
NAN_METHOD(WalletDumpWallet);
NAN_METHOD(WalletImportWallet);
NAN_METHOD(WalletChangeLabel);
NAN_METHOD(WalletDeleteAccount);
NAN_METHOD(WalletIsMine);

/**
 * Node.js Internal Function Templates
 */

static void
async_start_node(uv_work_t *req);

static void
async_start_node_after(uv_work_t *req);

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
get_genesis_block(CBlock *genesis);

static void
async_get_progress(uv_work_t *req);

static void
async_get_progress_after(uv_work_t *req);

static void
async_get_tx(uv_work_t *req);

static void
async_get_tx_after(uv_work_t *req);

static void
async_get_addrtx(uv_work_t *req);

static void
async_get_addrtx_after(uv_work_t *req);

static void
async_broadcast_tx(uv_work_t *req);

static void
async_broadcast_tx_after(uv_work_t *req);

static void
async_wallet_sendto(uv_work_t *req);

static void
async_wallet_sendto_after(uv_work_t *req);

static void
async_wallet_sendfrom(uv_work_t *req);

static void
async_wallet_sendfrom_after(uv_work_t *req);

static void
async_import_key(uv_work_t *req);

static void
async_import_key_after(uv_work_t *req);

static void
async_dump_wallet(uv_work_t *req);

static void
async_dump_wallet_after(uv_work_t *req);

static void
async_import_wallet(uv_work_t *req);

static void
async_import_wallet_after(uv_work_t *req);

static inline void
cblock_to_jsblock(const CBlock& cblock, CBlockIndex* cblock_index, Local<Object> jsblock, bool is_new);

static inline void
ctx_to_jstx(const CTransaction& ctx, uint256 block_hash, Local<Object> jstx);

static inline void
jsblock_to_cblock(const Local<Object> jsblock, CBlock& cblock);

static inline void
jstx_to_ctx(const Local<Object> jstx, CTransaction& ctx);

static void
hook_packets(CNodeSignals& nodeSignals);

static void
unhook_packets(CNodeSignals& nodeSignals);

static bool
process_packets(CNode* pfrom);

static bool
process_packet(CNode* pfrom, string strCommand, CDataStream& vRecv, int64_t nTimeReceived);

static void
AcentryToJSON_V8(const CAccountingEntry& acentry,
                const string& strAccount, Local<Array>& ret, int a_count);

static void
WalletTxToJSON_V8(const CWalletTx& wtx, Local<Object>& entry);

static void
MaybePushAddress_V8(Local<Object>& entry, const CTxDestination &dest);

static void
ListTransactions_V8(const CWalletTx& wtx, const string& strAccount,
                  int nMinDepth, bool fLong, Local<Array> ret,
                  const isminefilter& filter);

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

/**
 * Private Structs
 * Used for async functions and necessary linked lists at points.
 */

#if 0
typedef struct _prev_list {
  std::string addr;
  int64_t val;
  struct _prev_list *next;
} prev_list;
#endif

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
  Persistent<Function> callback;
};

/**
 * async_block_data
 */

struct async_block_data {
  std::string err_msg;
  std::string hash;
  int64_t height;
  CBlock cblock;
  CBlockIndex* cblock_index;
#if 0
  prev_list *inputs;
#endif
  Persistent<Function> callback;
};

/**
 * async_tx_data
 */

struct async_tx_data {
  std::string err_msg;
  std::string txHash;
  std::string blockHash;
  CTransaction ctx;
#if 0
  prev_list *inputs;
#endif
  Persistent<Function> callback;
};

/**
 * async_addrtx_data
 */

typedef struct _ctx_list {
  CTransaction ctx;
  uint256 blockhash;
  struct _ctx_list *next;
} ctx_list;

struct async_addrtx_data {
  std::string err_msg;
  std::string addr;
  ctx_list *ctxs;
  Persistent<Function> callback;
};

/**
 * async_broadcast_tx_data
 */

struct async_broadcast_tx_data {
  std::string err_msg;
  Persistent<Object> jstx;
  CTransaction ctx;
  std::string tx_hash;
  bool override_fees;
  bool own_only;
  Persistent<Function> callback;
};

/**
 * async_wallet_sendto_data
 */

struct async_wallet_sendto_data {
  std::string err_msg;
  std::string tx_hash;
  std::string address;
  int64_t nAmount;
  CWalletTx wtx;
  Persistent<Function> callback;
};

/**
 * async_wallet_sendfrom_data
 */

struct async_wallet_sendfrom_data {
  std::string err_msg;
  std::string tx_hash;
  std::string address;
  int64_t nAmount;
  int nMinDepth;
  CWalletTx wtx;
  Persistent<Function> callback;
};

/**
 * async_import_key_data
 */

struct async_import_key_data {
  std::string err_msg;
  bool fRescan;
  Persistent<Function> callback;
};

/**
 * async_import_wallet_data
 */

struct async_import_wallet_data {
  std::string err_msg;
  std::string path;
  Persistent<Function> callback;
};

/**
 * async_dump_wallet_data
 */

struct async_dump_wallet_data {
  std::string err_msg;
  std::string path;
  Persistent<Function> callback;
};

/**
 * Read Raw DB
 */

static ctx_list *
read_addr(const std::string addr);

/**
 * Functions
 */

/**
 * StartBitcoind()
 * bitcoind.start(callback)
 * Start the bitcoind node with AppInit2() on a separate thread.
 */

NAN_METHOD(StartBitcoind) {
  NanScope();

  Local<Function> callback;
  std::string datadir = std::string("");
  bool rpc = false;
  bool testnet = false;

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
  data->testnet = testnet;
  data->rpc = rpc;
  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_start_node,
    (uv_after_work_cb)async_start_node_after);

  assert(status == 0);

  NanReturnValue(NanNew<Number>(-1));
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
  start_node();
  data->result = std::string("start_node(): bitcoind opened.");
}

/**
 * async_start_node_after()
 * Execute our callback.
 */

static void
async_start_node_after(uv_work_t *req) {
  NanScope();
  async_node_data *data = static_cast<async_node_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->result))
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * start_node(void)
 * Start AppInit2() on a separate thread, wait for
 * pwalletMain instantiation (and signal() calls).
 * Unfortunately, we need to wait for the initialization
 * to unhook the signal handlers so we can use them
 * from node.js in javascript.
 */

static int
start_node(void) {
  SetupEnvironment();

  noui_connect();

  (boost::thread *)new boost::thread(boost::bind(&start_node_thread));

  // Wait for wallet to be instantiated. This also avoids
  // a race condition with signals not being set up.
  while (!pwalletMain) {
    useconds_t usec = 100 * 1000;
    usleep(usec);
  }

  // Drop the bitcoind signal handlers: we want our own.
  signal(SIGINT, SIG_DFL);
  signal(SIGHUP, SIG_DFL);
  signal(SIGQUIT, SIG_DFL);

  // Hook into packet handling
  hook_packets(GetNodeSignals());

  return 0;
}

static void
start_node_thread(void) {
  boost::thread_group threadGroup;
  boost::thread* detectShutdownThread = NULL;

  // Workaround for AppInit2() arg parsing. Not ideal, but it works.
  int argc = 0;
  char **argv = (char **)malloc((3 + 1) * sizeof(char **));

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
      fprintf(stderr, "bitcoind.js: Bad -datadir value.");
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

  argv[argc] = NULL;

  bool fRet = false;
  try {
    ParseParameters((const int)argc, (const char **)argv);

    if (!boost::filesystem::is_directory(GetDataDir(false))) {
      fprintf(stderr,
        "bitcoind.js: Specified data directory \"%s\" does not exist.\n",
        mapArgs["-datadir"].c_str());
      return;
    }

    try {
      ReadConfigFile(mapArgs, mapMultiArgs);
    } catch(std::exception &e) {
      fprintf(stderr,
        "bitcoind.js: Error reading configuration file: %s\n", e.what());
      return;
    }

    // mapArgs["-datadir"] = g_data_dir;
    // mapArgs["-server"] = g_rpc ? "1" : "0";
    // mapArgs["-testnet"] = g_testnet ? "1" : "0";

    if (!SelectParamsFromCommandLine()) {
      fprintf(stderr,
        "bitcoind.js: Invalid combination of -regtest and -testnet.\n");
      return;
    }

    // XXX Potentially add an option for this.
    // This is probably a good idea if people try to start bitcoind while
    // running a program which links to libbitcoind.so, but disable it for now.
    CreatePidFile(GetPidFile(), getpid());

    detectShutdownThread = new boost::thread(
      boost::bind(&DetectShutdownThread, &threadGroup));
    fRet = AppInit2(threadGroup);
  } catch (std::exception& e) {
    fprintf(stderr, "bitcoind.js: AppInit(): std::exception");
  } catch (...) {
    fprintf(stderr, "bitcoind.js: AppInit(): other exception");
  }

  if (!fRet) {
    if (detectShutdownThread) {
      detectShutdownThread->interrupt();
    }
    threadGroup.interrupt_all();
  }

  if (detectShutdownThread) {
    detectShutdownThread->join();
    delete detectShutdownThread;
    detectShutdownThread = NULL;
  }
  Shutdown();

  // bitcoind is shutdown, notify the main thread.
  shutdown_complete = true;
}

/**
 * StopBitcoind()
 * bitcoind.stop(callback)
 */

NAN_METHOD(StopBitcoind) {
  NanScope();

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
  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_stop_node,
    (uv_after_work_cb)async_stop_node_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

/**
 * async_stop_node()
 * Call StartShutdown() to join the boost threads, which will call Shutdown()
 * and set shutdown_complete to true to notify the main node.js thread.
 */

static void
async_stop_node(uv_work_t *req) {
  async_node_data *data = static_cast<async_node_data*>(req->data);
  unhook_packets(GetNodeSignals());
  StartShutdown();
  data->result = std::string("stop_node(): bitcoind shutdown.");
}

/**
 * async_stop_node_after()
 * Execute our callback.
 */

static void
async_stop_node_after(uv_work_t *req) {
  NanScope();
  async_node_data* data = static_cast<async_node_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->result))
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

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
 * bitcoind.getBlock([blockHash,blockHeight], callback)
 * Read any block from disk asynchronously.
 */

NAN_METHOD(GetBlock) {
  NanScope();

  if (args.Length() < 2
      || (!args[0]->IsString() || !args[0]->IsNumber())
      || !args[1]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.getBlock([blockHash,blockHeight], callback)");
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

  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_get_block,
    (uv_after_work_cb)async_get_block_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_get_block(uv_work_t *req) {
  async_block_data* data = static_cast<async_block_data*>(req->data);

  if (data->height != -1) {
    CBlockIndex* pblockindex = chainActive[data->height];
    CBlock cblock;
    if (ReadBlockFromDisk(cblock, pblockindex)) {
      data->cblock = cblock;
      data->cblock_index = pblockindex;
    } else {
      data->err_msg = std::string("get_block(): failed.");
    }
    return;
  }

  std::string strHash = data->hash;
  uint256 hash(strHash);
  CBlock cblock;
  CBlockIndex* pblockindex = mapBlockIndex[hash];

  if (ReadBlockFromDisk(cblock, pblockindex)) {
    data->cblock = cblock;
    data->cblock_index = pblockindex;
#if 0
    BOOST_FOREACH(const CTransaction& ctx, cblock.vtx) {
      BOOST_FOREACH(const CTxIn& txin, ctx.vin) {
        CTransaction prev_tx;
        if (GetTransaction(txin.prevout.hash, prev_tx, block_hash, true)) {
          CTxDestination from;
          CTxOut prev_out = prev_tx.vout[txin.prevout.n];
          ExtractDestination(prev_out.scriptPubKey, from);
          CBitcoinAddress addrFrom(from);
          std::string addr = addrFrom.ToString();
          int64_t val = (int64_t)prev_out.nValue;
          prev_list *cur = new prev_list();
          cur->addr = addr;
          cur->val = val;
          if (data->inputs == NULL) {
            data->inputs = cur;
          } else {
            data->inputs->next = cur;
            data->inputs = cur;
          }
        }
      }
    }
#endif
  } else {
    data->err_msg = std::string("get_block(): failed.");
  }
}

static void
async_get_block_after(uv_work_t *req) {
  NanScope();
  async_block_data* data = static_cast<async_block_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const CBlock& cblock = data->cblock;
    CBlockIndex* cblock_index = data->cblock_index;

    Local<Object> jsblock = NanNew<Object>();
    cblock_to_jsblock(cblock, cblock_index, jsblock, false);

#if 0
    prev_list *head = data->inputs;
    prev_list *cur = data->inputs;
    prev_list *next;
    for (int i = 0; i < jsblock->tx->ength(); i++) {
      for (int j = 0; j < jstx->vin->Length(); j++) {
        next = cur->next;
        jsblock.
        Local<Object> jsprev = NanNew<Object>();
        jsprev->Set(NanNew<String>("address"), NanNew<String>(cur->addr));
        jsprev->Set(NanNew<String>("value"), NanNew<Number>(cur->val));
        jsblock->tx->Get(i)->vin->Get(j)->Set(NanNew<String>("prev"), jsprev);
        delete cur;
        cur = next;
      }
    }
#endif

    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(jsblock)
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * GetTx()
 * bitcoind.getTx(txHash, [blockHash], callback)
 * Read any transaction from disk asynchronously.
 */

NAN_METHOD(GetTx) {
  NanScope();

  if (args.Length() < 3
      || !args[0]->IsString()
      || !args[1]->IsString()
      || !args[2]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.getTx(txHash, [blockHash], callback)");
  }

  String::Utf8Value txHash_(args[0]->ToString());
  String::Utf8Value blockHash_(args[1]->ToString());
  Local<Function> callback = Local<Function>::Cast(args[2]);

  std::string txHash = std::string(*txHash_);
  std::string blockHash = std::string(*blockHash_);

  if (blockHash == "") {
    blockHash = std::string(
      "0000000000000000000000000000000000000000000000000000000000000000");
  }

  async_tx_data *data = new async_tx_data();
  data->err_msg = std::string("");
  data->txHash = txHash;
  data->blockHash = blockHash;
  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_get_tx,
    (uv_after_work_cb)async_get_tx_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_get_tx(uv_work_t *req) {
  async_tx_data* data = static_cast<async_tx_data*>(req->data);

  uint256 hash(data->txHash);
  uint256 block_hash(data->blockHash);
  CTransaction ctx;

  if (GetTransaction(hash, ctx, block_hash, true)) {
    data->ctx = ctx;
    goto collect_prev;
  } else {
    if (data->blockHash != "0000000000000000000000000000000000000000000000000000000000000000") {
      CBlock block;
      CBlockIndex* pblockindex = mapBlockIndex[block_hash];
      if (ReadBlockFromDisk(block, pblockindex)) {
        BOOST_FOREACH(const CTransaction &tx, block.vtx) {
          if (tx.GetHash() == hash) {
            data->ctx = tx;
            goto collect_prev;
          }
        }
      }
    }
    data->err_msg = std::string("get_tx(): failed.");
  }

  return;

collect_prev:
  return;

#if 0
  BOOST_FOREACH(const CTxIn& txin, ctx.vin) {
    CTransaction prev_tx;
    if (GetTransaction(txin.prevout.hash, prev_tx, block_hash, true)) {
      CTxDestination from;
      CTxOut prev_out = prev_tx.vout[txin.prevout.n];
      ExtractDestination(prev_out.scriptPubKey, from);
      CBitcoinAddress addrFrom(from);
      std::string addr = addrFrom.ToString();
      int64_t val = (int64_t)prev_out.nValue;
      prev_list *cur = new prev_list();
      cur->addr = addr;
      cur->val = val;
      if (data->inputs == NULL) {
        data->inputs = cur;
      } else {
        data->inputs->next = cur;
        data->inputs = cur;
      }
    }
  }
#endif
}

static void
async_get_tx_after(uv_work_t *req) {
  NanScope();
  async_tx_data* data = static_cast<async_tx_data*>(req->data);

  std::string txHash = data->txHash;
  std::string blockHash = data->blockHash;
  CTransaction ctx = data->ctx;

  uint256 hash(txHash);
  uint256 block_hash(blockHash);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    Local<Object> jstx = NanNew<Object>();
    ctx_to_jstx(ctx, block_hash, jstx);

    // XXX Do this for GetBlock, and PacketHook
#if 0
    prev_list *head = data->inputs;
    prev_list *cur = data->inputs;
    prev_list *next;
    for (int i = 0; i < jstx->vin->Length(); i++) {
      next = cur->next;
      Local<Object> jsprev = NanNew<Object>();
      jsprev->Set(NanNew<String>("address"), NanNew<String>(cur->addr));
      jsprev->Set(NanNew<String>("value"), NanNew<Number>(cur->val));
      jstx->vin->Get(i)->Set(NanNew<String>("prev"), jsprev);
      delete cur;
      cur = next;
    }
#endif

    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(jstx)
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * BroadcastTx()
 * bitcoind.broadcastTx(tx, override_fees, own_only, callback)
 * Broadcast a raw transaction. This can be used to relay transaction received
 * or to broadcast one's own transaction.
 */

NAN_METHOD(BroadcastTx) {
  NanScope();

  if (args.Length() < 4
      || !args[0]->IsObject()
      || !args[1]->IsBoolean()
      || !args[2]->IsBoolean()
      || !args[3]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.broadcastTx(tx, override_fees, own_only, callback)");
  }

  Local<Object> jstx = Local<Object>::Cast(args[0]);
  Local<Function> callback = Local<Function>::Cast(args[3]);

  async_broadcast_tx_data *data = new async_broadcast_tx_data();
  data->override_fees = args[1]->ToBoolean()->IsTrue();
  data->own_only = args[2]->ToBoolean()->IsTrue();
  data->err_msg = std::string("");
  data->callback = Persistent<Function>::New(callback);

  data->jstx = Persistent<Object>::New(jstx);

  CTransaction ctx;
  jstx_to_ctx(jstx, ctx);
  data->ctx = ctx;

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_broadcast_tx,
    (uv_after_work_cb)async_broadcast_tx_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_broadcast_tx(uv_work_t *req) {
  async_broadcast_tx_data* data = static_cast<async_broadcast_tx_data*>(req->data);

  bool fOverrideFees = false;
  bool fOwnOnly = false;

  if (data->override_fees) {
    fOverrideFees = true;
  }

  if (data->own_only) {
    fOwnOnly = true;
  }

  CTransaction ctx = data->ctx;

  uint256 hashTx = ctx.GetHash();

  bool fHave = false;
  CCoinsViewCache &view = *pcoinsTip;
  CCoins existingCoins;
  if (fOwnOnly) {
    fHave = view.GetCoins(hashTx, existingCoins);
    if (!fHave) {
      CValidationState state;
      if (!AcceptToMemoryPool(mempool, state, ctx, false, NULL, !fOverrideFees)) {
        data->err_msg = std::string("TX rejected");
        return;
      }
    }
  }

  if (fHave) {
    if (existingCoins.nHeight < 1000000000) {
      data->err_msg = std::string("transaction already in block chain");
      return;
    }
  } else {
    // With v0.9.0
    // SyncWithWallets(hashTx, ctx, NULL);
  }

  RelayTransaction(ctx);

  data->tx_hash = hashTx.GetHex();
}

static void
async_broadcast_tx_after(uv_work_t *req) {
  NanScope();
  async_broadcast_tx_data* data = static_cast<async_broadcast_tx_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 3;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->tx_hash)),
      Local<Value>::New(data->jstx)
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * VerifyBlock()
 * bitcoindjs.verifyBlock(block)
 * This will verify the authenticity of a block (merkleRoot, etc)
 * using the internal bitcoind functions.
 */

NAN_METHOD(VerifyBlock) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.verifyBlock(block)");
  }

  Local<Object> jsblock = Local<Object>::Cast(args[0]);

  String::Utf8Value block_hex_(jsblock->Get(NanNew<String>("hex"))->ToString());
  std::string block_hex = std::string(*block_hex_);

  CBlock cblock;
  jsblock_to_cblock(jsblock, cblock);

  CValidationState state;
  bool valid = CheckBlock(cblock, state);

  NanReturnValue(NanNew<Boolean>(valid));
}

/**
 * VerifyTransaction()
 * bitcoindjs.verifyTransaction(tx)
 * This will verify a transaction, ensuring it is signed properly using the
 * internal bitcoind functions.
 */

NAN_METHOD(VerifyTransaction) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.verifyTransaction(tx)");
  }

  Local<Object> jstx = Local<Object>::Cast(args[0]);

  String::Utf8Value tx_hex_(jstx->Get(NanNew<String>("hex"))->ToString());
  std::string tx_hex = std::string(*tx_hex_);

  CTransaction ctx;
  jstx_to_ctx(jstx, ctx);

  CValidationState state;
  bool valid = CheckTransaction(ctx, state);

  std::string reason;
  bool standard = IsStandardTx(ctx, reason);

  NanReturnValue(NanNew<Boolean>(valid && standard));
}

/**
 * FillTransaction()
 * bitcoindjs.fillTransaction(tx, options);
 * This will fill a javascript transaction object with the proper available
 * unpsent outputs as inputs and sign them using internal bitcoind functions.
 */

NAN_METHOD(FillTransaction) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsObject() || !args[1]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.fillTransaction(tx, options)");
  }

  Local<Object> jstx = Local<Object>::Cast(args[0]);
  // Local<Object> options = Local<Object>::Cast(args[1]);

  String::Utf8Value tx_hex_(jstx->Get(NanNew<String>("hex"))->ToString());
  std::string tx_hex = std::string(*tx_hex_);

  CTransaction ctx;
  jstx_to_ctx(jstx, ctx);

  // Get total value of outputs
  // Get the scriptPubKey of the first output (presumably our destination)
  int64_t nValue = 0;
  for (unsigned int vo = 0; vo < ctx.vout.size(); vo++) {
    const CTxOut& txout = ctx.vout[vo];
    int64_t value = txout.nValue;
    const CScript& scriptPubKey = txout.scriptPubKey;
    nValue += value;
  }

  if (nValue <= 0)
    return NanThrowError("Invalid amount");
  // With v0.9.0:
  // if (nValue + nTransactionFee > pwalletMain->GetBalance())
  // if (nValue + payTxFee > pwalletMain->GetBalance())
  //   return NanThrowError("Insufficient funds");
  if (nValue > pwalletMain->GetBalance())
    return NanThrowError("Insufficient funds");

  // With v0.9.0:
  // int64_t nFeeRet = nTransactionFee;
  int64_t nFeeRet = 1000;
  // int64_t nFeeRet = CFeeRate(nAmount, 1000);

  if (pwalletMain->IsLocked()) {
    return NanThrowError("Error: Wallet locked, unable to create transaction!");
  }

  CCoinControl* coinControl = new CCoinControl();

  int64_t nTotalValue = nValue + nFeeRet;
  set<pair<const CWalletTx*,unsigned int> > setCoins;
  int64_t nValueIn = 0;

  if (!pwalletMain->SelectCoins(nTotalValue, setCoins, nValueIn, coinControl)) {
    return NanThrowError("Insufficient funds");
  }

  // Fill vin
  BOOST_FOREACH(const PAIRTYPE(const CWalletTx*, unsigned int)& coin, setCoins) {
    ctx.vin.push_back(CTxIn(coin.first->GetHash(), coin.second));
  }

  // Sign
  int nIn = 0;
  BOOST_FOREACH(const PAIRTYPE(const CWalletTx*,unsigned int)& coin, setCoins) {
    if (!SignSignature(
      (const CKeyStore&)*pwalletMain,
      (const CTransaction&)*coin.first,
      (CMutableTransaction&)ctx,
      nIn++)
    ) {
      return NanThrowError("Signing transaction failed");
    }
  }

  // Turn our CTransaction into a javascript Transaction
  Local<Object> new_jstx = NanNew<Object>();
  ctx_to_jstx(ctx, 0, new_jstx);

  NanReturnValue(new_jstx);
}

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
#ifdef ENABLE_WALLET
  if (pwalletMain) {
    obj->Set(NanNew<String>("walletversion"), NanNew<Number>(pwalletMain->GetVersion()));
    obj->Set(NanNew<String>("balance"), NanNew<Number>(pwalletMain->GetBalance())); // double
  }
#endif
  obj->Set(NanNew<String>("blocks"), NanNew<Number>((int)chainActive.Height())->ToInt32());
  obj->Set(NanNew<String>("timeoffset"), NanNew<Number>(GetTimeOffset()));
  obj->Set(NanNew<String>("connections"), NanNew<Number>((int)vNodes.size())->ToInt32());
  obj->Set(NanNew<String>("proxy"), NanNew<String>(proxy.IsValid() ? proxy.ToStringIPPort() : std::string("")));
  obj->Set(NanNew<String>("difficulty"), NanNew<Number>((double)GetDifficulty()));
  obj->Set(NanNew<String>("testnet"), NanNew<Boolean>(Params().NetworkID() == CBaseChainParams::TESTNET));
#ifdef ENABLE_WALLET
  if (pwalletMain) {
    obj->Set(NanNew<String>("keypoololdest"), NanNew<Number>(pwalletMain->GetOldestKeyPoolTime()));
    obj->Set(NanNew<String>("keypoolsize"), NanNew<Number>((int)pwalletMain->GetKeyPoolSize())->ToInt32());
  }
  if (pwalletMain && pwalletMain->IsCrypted()) {
    obj->Set(NanNew<String>("unlocked_until"), NanNew<Number>(nWalletUnlockTime));
  }
  obj->Set(NanNew<String>("paytxfee"), NanNew<Number>(payTxFee.GetFeePerK())); // double
#endif
  obj->Set(NanNew<String>("relayfee"), NanNew<Number>(::minRelayTxFee.GetFeePerK())); // double
  obj->Set(NanNew<String>("errors"), NanNew<String>(GetWarnings("statusbar")));

  NanReturnValue(obj);
}

/**
 * GetPeerInfo()
 * bitcoindjs.getPeerInfo()
 * Get peer information
 */

NAN_METHOD(GetPeerInfo) {
  NanScope();

  if (args.Length() > 0) {
    return NanThrowError(
      "Usage: bitcoindjs.getPeerInfo()");
  }

  Local<Array> array = NanNew<Array>();
  int i = 0;

  vector<CNodeStats> vstats;
  vstats.clear();
  LOCK(cs_vNodes);
  vstats.reserve(vNodes.size());
  BOOST_FOREACH(CNode* pnode, vNodes) {
    CNodeStats stats;
    pnode->copyStats(stats);
    vstats.push_back(stats);
  }

  BOOST_FOREACH(const CNodeStats& stats, vstats) {
    Local<Object> obj = NanNew<Object>();

    CNodeStateStats statestats;
    bool fStateStats = GetNodeStateStats(stats.nodeid, statestats);
    obj->Set(NanNew<String>("id"), NanNew<Number>(stats.nodeid));
    obj->Set(NanNew<String>("addr"), NanNew<String>(stats.addrName));
    if (!(stats.addrLocal.empty())) {
      obj->Set(NanNew<String>("addrlocal"), NanNew<String>(stats.addrLocal));
    }
    obj->Set(NanNew<String>("services"), NanNew<String>(strprintf("%016x", stats.nServices)));
    obj->Set(NanNew<String>("lastsend"), NanNew<Number>(stats.nLastSend));
    obj->Set(NanNew<String>("lastrecv"), NanNew<Number>(stats.nLastRecv));
    obj->Set(NanNew<String>("bytessent"), NanNew<Number>(stats.nSendBytes));
    obj->Set(NanNew<String>("bytesrecv"), NanNew<Number>(stats.nRecvBytes));
    obj->Set(NanNew<String>("conntime"), NanNew<Number>(stats.nTimeConnected));
    obj->Set(NanNew<String>("pingtime"), NanNew<Number>(stats.dPingTime)); // double
    if (stats.dPingWait > 0.0) {
      obj->Set(NanNew<String>("pingwait"), NanNew<Number>(stats.dPingWait)); // double
    }
    obj->Set(NanNew<String>("version"), NanNew<Number>(stats.nVersion));
    obj->Set(NanNew<String>("subver"), NanNew<String>(stats.cleanSubVer));
    obj->Set(NanNew<String>("inbound"), NanNew<Boolean>(stats.fInbound));
    obj->Set(NanNew<String>("startingheight"), NanNew<Number>(stats.nStartingHeight));
    if (fStateStats) {
      obj->Set(NanNew<String>("banscore"), NanNew<Number>(statestats.nMisbehavior));
      obj->Set(NanNew<String>("syncheight"), NanNew<Number>(statestats.nSyncHeight)->ToInt32());
    }
    obj->Set(NanNew<String>("syncnode"), NanNew<Boolean>(stats.fSyncNode));
    obj->Set(NanNew<String>("whitelisted"), NanNew<Boolean>(stats.fWhitelisted));
    // obj->Set(NanNew<String>("relaytxes"), NanNew<Boolean>(stats.fRelayTxes));

    array->Set(i, obj);
    i++;
  }

  NanReturnValue(array);
}

/**
 * GetAddresses()
 * bitcoindjs.getAddresses()
 * Get all addresses
 */

NAN_METHOD(GetAddresses) {
  NanScope();

  if (args.Length() > 0) {
    return NanThrowError(
      "Usage: bitcoindjs.getAddresses()");
  }

  Local<Array> array = NanNew<Array>();
  int i = 0;

  std::vector<CAddress> vAddr = addrman.GetAddr();

  BOOST_FOREACH(const CAddress& addr, vAddr) {
    Local<Object> obj = NanNew<Object>();

    char nServices[21] = {0};
    int written = snprintf(nServices, sizeof(nServices), "%020lu", (uint64_t)addr.nServices);
    assert(written == 20);

    obj->Set(NanNew<String>("services"), NanNew<String>((char *)nServices));
    obj->Set(NanNew<String>("time"), NanNew<Number>((unsigned int)addr.nTime)->ToUint32());
    obj->Set(NanNew<String>("last"), NanNew<Number>((int64_t)addr.nLastTry));
    obj->Set(NanNew<String>("ip"), NanNew<String>((std::string)addr.ToStringIP()));
    obj->Set(NanNew<String>("port"), NanNew<Number>((unsigned short)addr.GetPort())->ToUint32());
    obj->Set(NanNew<String>("address"), NanNew<String>((std::string)addr.ToStringIPPort()));

    array->Set(i, obj);
    i++;
  }

  NanReturnValue(array);
}

/**
 * GetProgress()
 * bitcoindjs.getProgress(callback)
 * Get progress of blockchain download
 */

NAN_METHOD(GetProgress) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.getProgress(callback)");
  }

  Local<Function> callback = Local<Function>::Cast(args[0]);

  CBlockIndex *pindex = chainActive.Tip();

  async_block_data *data = new async_block_data();
  data->err_msg = std::string("");
  data->hash = pcoinsTip->GetBestBlock().GetHex(); // .ToString();

  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_get_progress,
    (uv_after_work_cb)async_get_progress_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_get_progress(uv_work_t *req) {
  async_get_block(req);
}

static void
async_get_progress_after(uv_work_t *req) {
  NanScope();
  async_block_data* data = static_cast<async_block_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const CBlock& cblock = data->cblock;
    CBlockIndex* cblock_index = data->cblock_index;

    Local<Object> jsblock = NanNew<Object>();
    cblock_to_jsblock(cblock, cblock_index, jsblock, false);

    CBlock cgenesis;
    get_genesis_block(&cgenesis);

    Local<Object> genesis = NanNew<Object>();
    cblock_to_jsblock(cgenesis, NULL, genesis, false);

    int64_t ts_ = cblock.GetBlockTime();
    time_t now_ = time(NULL);

    //int64_t now = (int64_t)(time(NULL) - (10 * 60));
    int64_t ts = (int64_t)ts_;

    // Assume last block was ten minutes ago:
    int64_t now = ((int64_t)now_ - (10 * 60));
    int64_t left = (now - ts);

    unsigned int hours_behind = left / 60 / 60;
    unsigned int days_behind = left / 60 / 60 / 24;
    double cur = (double)(now - left) / (double)now;
    unsigned int percent = (unsigned int)(cur * 100.0);

    Local<Object> result = NanNew<Object>();

    result->Set(NanNew<String>("blocks"), NanNew<Number>(cblock_index->nHeight));
    result->Set(NanNew<String>("connections"), NanNew<Number>((int)vNodes.size())->ToInt32());
    result->Set(NanNew<String>("genesisBlock"), genesis);
    result->Set(NanNew<String>("currentBlock"), jsblock);
    result->Set(NanNew<String>("hoursBehind"), NanNew<Number>(hours_behind));
    result->Set(NanNew<String>("daysBehind"), NanNew<Number>(days_behind));
    result->Set(NanNew<String>("percent"), NanNew<Number>(percent));

    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(result)
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * SetGenerate()
 * bitcoindjs.setGenerate(options)
 * Set coin generation / mining
 */

NAN_METHOD(SetGenerate) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.setGenerate(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  if (pwalletMain == NULL) {
    return NanThrowError("Method not found (disabled)");
  }

  bool fGenerate = true;
  if (options->Get(NanNew<String>("generate"))->IsBoolean()) {
    fGenerate = options->Get(NanNew<String>("generate"))->ToBoolean()->IsTrue();
  }

  int nGenProcLimit = -1;
  if (options->Get(NanNew<String>("limit"))->IsNumber()) {
    nGenProcLimit = (int)options->Get(NanNew<String>("limit"))->IntegerValue();
    if (nGenProcLimit == 0) {
      fGenerate = false;
    }
  }

  // -regtest mode: don't return until nGenProcLimit blocks are generated
  if (fGenerate && Params().MineBlocksOnDemand()) {
    int nHeightStart = 0;
    int nHeightEnd = 0;
    int nHeight = 0;
    int nGenerate = (nGenProcLimit > 0 ? nGenProcLimit : 1);
    { // Don't keep cs_main locked
      LOCK(cs_main);
      nHeightStart = chainActive.Height();
      nHeight = nHeightStart;
      nHeightEnd = nHeightStart+nGenerate;
    }
    int nHeightLast = -1;
    while (nHeight < nHeightEnd) {
      if (nHeightLast != nHeight) {
        nHeightLast = nHeight;
        GenerateBitcoins(fGenerate, pwalletMain, 1);
      }
      MilliSleep(1);
      {   // Don't keep cs_main locked
        LOCK(cs_main);
        nHeight = chainActive.Height();
      }
    }
  } else { // Not -regtest: start generate thread, return immediately
    mapArgs["-gen"] = (fGenerate ? "1" : "0");
    mapArgs ["-genproclimit"] = itostr(nGenProcLimit);
    GenerateBitcoins(fGenerate, pwalletMain, nGenProcLimit);
  }

  NanReturnValue(True());
}

/**
 * GetGenerate()
 * bitcoindjs.GetGenerate()
 * Get coin generation / mining
 */

NAN_METHOD(GetGenerate) {
  NanScope();
  bool generate = GetBoolArg("-gen", false);
  NanReturnValue(NanNew<Boolean>(generate));
}

/**
 * GetMiningInfo()
 * bitcoindjs.getMiningInfo()
 * Get coin generation / mining information
 */

NAN_METHOD(GetMiningInfo) {
  NanScope();

  Local<Object> obj = NanNew<Object>();

  json_spirit::Array empty_params;

  // (json_spirit::Value)GetNetworkHashPS(120 /* blocks=-1 */, -1 /* height=x */);
  // (int64_t)GetNetworkHashPS(120 /* blocks=-1 */, -1 /* height=x */).get_int64();
  // (int64_t)getnetworkhashps(empty_params, false).get_int64();

  // (json_spirit::Value)getgenerate(empty_params, false);
  // (bool)getgenerate(empty_params, false).get_bool();
  // (bool)GetBoolArg("-gen", false);

  // (json_spirit::Value)gethashespersec(empty_params, false);
  // (int64_t)gethashespersec(empty_params, false).get_int64();
  // int64_t hashespersec = 0;
  // if (GetTimeMillis() - nHPSTimerStart > 8000) {
  //   hashespersec = (int64_t)0;
  // } else {
  //   hashespersec = (int64_t)dHashesPerSec;
  // }

  obj->Set(NanNew<String>("blocks"), NanNew<Number>((int)chainActive.Height()));
  obj->Set(NanNew<String>("currentblocksize"), NanNew<Number>((uint64_t)nLastBlockSize));
  obj->Set(NanNew<String>("currentblocktx"), NanNew<Number>((uint64_t)nLastBlockTx));
  obj->Set(NanNew<String>("difficulty"), NanNew<Number>((double)GetDifficulty()));
  obj->Set(NanNew<String>("errors"), NanNew<String>(GetWarnings("statusbar")));
  obj->Set(NanNew<String>("genproclimit"), NanNew<Number>((int)GetArg("-genproclimit", -1)));
  // If lookup is -1, then use blocks since last difficulty change.
  // If lookup is larger than chain, then set it to chain length.
  // ~/bitcoin/src/json/json_spirit_value.h
  // ~/bitcoin/src/rpcmining.cpp
  obj->Set(NanNew<String>("networkhashps"), NanNew<Number>(
    (int64_t)getnetworkhashps(empty_params, false).get_int64()));
  obj->Set(NanNew<String>("pooledtx"), NanNew<Number>((uint64_t)mempool.size()));
  obj->Set(NanNew<String>("testnet"), NanNew<Boolean>(Params().NetworkID() == CBaseChainParams::TESTNET));
  obj->Set(NanNew<String>("chain"), NanNew<String>(Params().NetworkIDString()));
#ifdef ENABLE_WALLET
  obj->Set(NanNew<String>("generate"), NanNew<Boolean>(
    (bool)getgenerate(empty_params, false).get_bool()));
  obj->Set(NanNew<String>("hashespersec"), NanNew<Number>(
    (int64_t)gethashespersec(empty_params, false).get_int64()));
#endif

  NanReturnValue(obj);
}

/**
 * GetAddrTransactions()
 * bitcoind.getAddrTransactions(addr, callback)
 * Read any transaction from disk asynchronously.
 */

NAN_METHOD(GetAddrTransactions) {
  NanScope();

  if (args.Length() < 2
      || !args[0]->IsString()
      || !args[1]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.getAddrTransactions(addr, callback)");
  }

  String::Utf8Value addr_(args[0]->ToString());
  Local<Function> callback = Local<Function>::Cast(args[1]);

  Persistent<Function> cb;
  cb = Persistent<Function>::New(callback);

  std::string addr = std::string(*addr_);

  async_addrtx_data *data = new async_addrtx_data();
  data->err_msg = std::string("");
  data->addr = addr;
  data->ctxs = NULL;
  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_get_addrtx,
    (uv_after_work_cb)async_get_addrtx_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_get_addrtx(uv_work_t *req) {
  async_addrtx_data* data = static_cast<async_addrtx_data*>(req->data);

  CBitcoinAddress address = CBitcoinAddress(data->addr);
  if (!address.IsValid()) {
    data->err_msg = std::string("bad addr");
    return;
  }

#if 0
  CScript expected = GetScriptForDestination(address.Get());

  int64_t i = 0;
  int64_t height = chainActive.Height();

  for (; i <= height; i++) {
    CBlockIndex* pblockindex = chainActive[i];
    CBlock cblock;
    if (ReadBlockFromDisk(cblock, pblockindex)) {
      BOOST_FOREACH(const CTransaction& ctx, cblock.vtx) {
        // vin
        BOOST_FOREACH(const CTxIn& txin, ctx.vin) {
          if (txin.scriptSig.ToString() == expected.ToString()) {
            ctx_list *item = new ctx_list();
            item->ctx = ctx;
            uint256 hash(((CMerkleTx)ctx).hashBlock.GetHex());
            item->blockhash = hash;
            if (data->ctxs == NULL) {
              data->ctxs = item;
            } else {
              data->ctxs->next = item;
              data->ctxs = item;
            }
            goto done;
          }
        }

        // vout
        for (unsigned int vo = 0; vo < ctx.vout.size(); vo++) {
          const CTxOut& txout = ctx.vout[vo];
          const CScript& scriptPubKey = txout.scriptPubKey;
          txnouttype type;
          vector<CTxDestination> addresses;
          int nRequired;
          if (ExtractDestinations(scriptPubKey, type, addresses, nRequired)) {
            BOOST_FOREACH(const CTxDestination& addr, addresses) {
              std::string str_addr = CBitcoinAddress(addr).ToString();
              if (data->addr == str_addr) {
                ctx_list *item = new ctx_list();
                item->ctx = ctx;
                uint256 hash(((CMerkleTx)ctx).hashBlock.GetHex());
                item->blockhash = hash;
                if (data->ctxs == NULL) {
                  data->ctxs = item;
                } else {
                  data->ctxs->next = item;
                  data->ctxs = item;
                }
                goto done;
              }
            }
          }
        }
      }

done:
      continue;
    } else {
      data->err_msg = std::string("get_addrtx(): failed.");
      break;
    }
  }
  return;
#else
  ctx_list *ctxs = read_addr(data->addr);
  data->ctxs = ctxs;
  if (data->ctxs == NULL) {
    data->err_msg = std::string("Could not read database.");
  }
#endif
}

static void
async_get_addrtx_after(uv_work_t *req) {
  NanScope();
  async_addrtx_data* data = static_cast<async_addrtx_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Object> result = NanNew<Object>();
    Local<Array> tx = NanNew<Array>();
    int i = 0;
    ctx_list *next;
    for (ctx_list *item = data->ctxs; item; item = next) {
      Local<Object> jstx = NanNew<Object>();
      ctx_to_jstx(item->ctx, item->blockhash, jstx);
      tx->Set(i, jstx);
      i++;
      next = item->next;
      delete item;
    }
    result->Set(NanNew<String>("address"), NanNew<String>(data->addr));
    result->Set(NanNew<String>("tx"), tx);
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(result)
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * GetBestBlock()
 * bitcoindjs.getBestBlock()
 * Get the best block
 */

NAN_METHOD(GetBestBlock) {
  NanScope();

  if (args.Length() < 0) {
    return NanThrowError(
      "Usage: bitcoindjs.getBestBlock()");
  }

  //static CCoinsViewDB *pcoinsdbview = NULL;
  //pcoinsdbview = new CCoinsViewDB(nCoinDBCache, false, fReindex);
  //uint256 block_hash = pcoinsdbview->GetBestBlock();

  //CCoinsViewCache &viewChain = *pcoinsTip;
  uint256 block_hash = pcoinsTip->GetBestBlock();

  NanReturnValue(NanNew<String>(block_hash.GetHex()));
}

/**
 * GetBlockHex()
 * bitcoindjs.getBlockHex(callback)
 * This will return the hex value as well as hash of a javascript block object
 * (after being converted to a CBlock).
 */

NAN_METHOD(GetBlockHex) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.getBlockHex(block)");
  }

  Local<Object> jsblock = Local<Object>::Cast(args[0]);

  CBlock cblock;
  jsblock_to_cblock(jsblock, cblock);

  Local<Object> data = NanNew<Object>();

  data->Set(NanNew<String>("hash"), NanNew<String>(cblock.GetHash().GetHex()));

  CDataStream ssBlock(SER_NETWORK, PROTOCOL_VERSION);
  ssBlock << cblock;
  std::string strHex = HexStr(ssBlock.begin(), ssBlock.end());
  data->Set(NanNew<String>("hex"), NanNew<String>(strHex));

  NanReturnValue(data);
}

/**
 * GetTxHex()
 * bitcoindjs.getTxHex(tx)
 * This will return the hex value and hash for any tx, converting a js tx
 * object to a CTransaction.
 */

NAN_METHOD(GetTxHex) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.getTxHex(tx)");
  }

  Local<Object> jstx = Local<Object>::Cast(args[0]);

  CTransaction ctx;
  jstx_to_ctx(jstx, ctx);

  Local<Object> data = NanNew<Object>();

  data->Set(NanNew<String>("hash"), NanNew<String>(ctx.GetHash().GetHex()));

  CDataStream ssTx(SER_NETWORK, PROTOCOL_VERSION);
  ssTx << ctx;
  std::string strHex = HexStr(ssTx.begin(), ssTx.end());
  data->Set(NanNew<String>("hex"), NanNew<String>(strHex));

  NanReturnValue(data);
}

/**
 * BlockFromHex()
 * bitcoindjs.blockFromHex(hex)
 * Create a javascript block from a hex string.
 */

NAN_METHOD(BlockFromHex) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsString()) {
    return NanThrowError(
      "Usage: bitcoindjs.blockFromHex(hex)");
  }

  String::AsciiValue hex_string_(args[0]->ToString());
  std::string hex_string = *hex_string_;

  CBlock cblock;
  CDataStream ssData(ParseHex(hex_string), SER_NETWORK, PROTOCOL_VERSION);
  try {
    ssData >> cblock;
  } catch (std::exception &e) {
    NanThrowError("Bad Block decode");
  }

  Local<Object> jsblock = NanNew<Object>();
  // XXX Possibly pass true into is_new to search for CBlockIndex?
  cblock_to_jsblock(cblock, NULL, jsblock, false);

  NanReturnValue(jsblock);
}

/**
 * TxFromHex()
 * bitcoindjs.txFromHex(hex)
 * Create a javascript tx from a hex string.
 */

NAN_METHOD(TxFromHex) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsString()) {
    return NanThrowError(
      "Usage: bitcoindjs.txFromHex(hex)");
  }

  String::AsciiValue hex_string_(args[0]->ToString());
  std::string hex_string = *hex_string_;

  CTransaction ctx;
  CDataStream ssData(ParseHex(hex_string), SER_NETWORK, PROTOCOL_VERSION);
  try {
    ssData >> ctx;
  } catch (std::exception &e) {
    NanThrowError("Bad Block decode");
  }

  Local<Object> jstx = NanNew<Object>();
  ctx_to_jstx(ctx, 0, jstx);

  NanReturnValue(jstx);
}

/**
 * Linked List for queued packets
 */

typedef struct _poll_packets_list {
  CNode *pfrom;
  char *strCommand;
  CDataStream *vRecv;
  int64_t nTimeReceived;
  struct _poll_packets_list *next;
} poll_packets_list;

poll_packets_list *packets_queue_head = NULL;
poll_packets_list *packets_queue_tail = NULL;
boost::mutex poll_packets_mutex;

/**
 * HookPackets()
 * bitcoind.hookPackets(callback)
 */

NAN_METHOD(HookPackets) {
  NanScope();

  Local<Array> obj = NanNew<Array>();
  poll_packets_list *cur = NULL;
  poll_packets_list *next = NULL;
  int i = 0;

  poll_packets_mutex.lock();

  for (cur = packets_queue_head; cur; cur = next) {
    CNode *pfrom = cur->pfrom;
    std::string strCommand(cur->strCommand);
    CDataStream vRecv = *cur->vRecv;
    int64_t nTimeReceived = cur->nTimeReceived;

    Local<Object> o = NanNew<Object>();

    o->Set(NanNew<String>("name"), NanNew<String>(strCommand));
    o->Set(NanNew<String>("received"), NanNew<Number>((int64_t)nTimeReceived));
    o->Set(NanNew<String>("peerId"), NanNew<Number>(pfrom->id));
    // o->Set(NanNew<String>("peerId"), NanNew<Number>(pfrom->GetId()));
    o->Set(NanNew<String>("userAgent"),
      NanNew<String>(pfrom->cleanSubVer));

    if (strCommand == "version") {
      // Each connection can only send one version message
      if (pfrom->nVersion != 0) {
        NanReturnValue(Undefined());
      }

      bool fRelayTxes = false;
      int nStartingHeight = 0;
      int cleanSubVer = 0;
      //std::string strSubVer(strdup(pfrom->strSubVer.c_str()));
      std::string strSubVer = pfrom->strSubVer;
      int nVersion = pfrom->nVersion;
      uint64_t nServices = pfrom->nServices;

      int64_t nTime;
      CAddress addrMe;
      CAddress addrFrom;
      uint64_t nNonce = 1;
      vRecv >> nVersion >> nServices >> nTime >> addrMe;
      if (pfrom->nVersion < MIN_PEER_PROTO_VERSION) {
        // disconnect from peers older than this proto version
        NanReturnValue(Undefined());
      }

      if (nVersion == 10300) {
        nVersion = 300;
      }
      if (!vRecv.empty()) {
        vRecv >> addrFrom >> nNonce;
      }
      if (!vRecv.empty()) {
        vRecv >> LIMITED_STRING(strSubVer, 256);
        //cleanSubVer = SanitizeString(strSubVer);
        cleanSubVer = atoi(strSubVer.c_str());
      }
      if (!vRecv.empty()) {
        vRecv >> nStartingHeight;
      }
      if (!vRecv.empty()) {
        fRelayTxes = false;
      } else {
        fRelayTxes = true;
      }

      // Disconnect if we connected to ourself
      if (nNonce == nLocalHostNonce && nNonce > 1) {
        NanReturnValue(obj);
      }

      o->Set(NanNew<String>("receiveVersion"), NanNew<Number>(cleanSubVer));
      o->Set(NanNew<String>("version"), NanNew<Number>(nVersion));
      o->Set(NanNew<String>("height"), NanNew<Number>(nStartingHeight));
      o->Set(NanNew<String>("us"), NanNew<String>(addrMe.ToString()));
      o->Set(NanNew<String>("address"), NanNew<String>(pfrom->addr.ToString()));
      o->Set(NanNew<String>("relay"), NanNew<Boolean>(fRelayTxes));
    } else if (pfrom->nVersion == 0) {
      // Must have a version message before anything else
      NanReturnValue(Undefined());
    } else if (strCommand == "verack") {
      o->Set(NanNew<String>("receiveVersion"), NanNew<Number>(min(pfrom->nVersion, PROTOCOL_VERSION)));
    } else if (strCommand == "addr") {
      vector<CAddress> vAddr;
      vRecv >> vAddr;

      // Don't want addr from older versions unless seeding
      if (pfrom->nVersion < CADDR_TIME_VERSION && addrman.size() > 1000) {
        NanReturnValue(obj);
      }

      // Bad address size
      if (vAddr.size() > 1000) {
        NanReturnValue(Undefined());
      }

      Local<Array> array = NanNew<Array>();
      int i = 0;

      // Get the new addresses
      int64_t nNow = GetAdjustedTime();
      BOOST_FOREACH(CAddress& addr, vAddr) {
        boost::this_thread::interruption_point();

        unsigned int nTime = addr.nTime;
        if (nTime <= 100000000 || nTime > nNow + 10 * 60) {
          nTime = nNow - 5 * 24 * 60 * 60;
        }

        bool fReachable = IsReachable(addr);

        Local<Object> obj = NanNew<Object>();

        char nServices[21] = {0};
        int written = snprintf(nServices, sizeof(nServices), "%020lu", (uint64_t)addr.nServices);
        assert(written == 20);

        obj->Set(NanNew<String>("services"), NanNew<String>((char *)nServices));
        obj->Set(NanNew<String>("time"), NanNew<Number>((unsigned int)nTime)->ToUint32());
        obj->Set(NanNew<String>("last"), NanNew<Number>((int64_t)addr.nLastTry));
        obj->Set(NanNew<String>("ip"), NanNew<String>((std::string)addr.ToStringIP()));
        obj->Set(NanNew<String>("port"), NanNew<Number>((unsigned short)addr.GetPort())->ToUint32());
        obj->Set(NanNew<String>("address"), NanNew<String>((std::string)addr.ToStringIPPort()));
        obj->Set(NanNew<String>("reachable"), NanNew<Boolean>((bool)fReachable));

        array->Set(i, obj);
        i++;
      }

      o->Set(NanNew<String>("addresses"), array);
    } else if (strCommand == "inv") {
      vector<CInv> vInv;
      vRecv >> vInv;

      // Bad size
      if (vInv.size() > MAX_INV_SZ) {
        NanReturnValue(Undefined());
      }

      LOCK(cs_main);

      Local<Array> array = NanNew<Array>();
      int i = 0;

      for (unsigned int nInv = 0; nInv < vInv.size(); nInv++) {
        const CInv &inv = vInv[nInv];

        boost::this_thread::interruption_point();

        //bool fAlreadyHave = AlreadyHave(inv);

        // Bad size
        if (pfrom->nSendSize > (SendBufferSize() * 2)) {
          NanReturnValue(Undefined());
        }

        Local<Object> item = NanNew<Object>();
        //item->Set(NanNew<String>("have"), NanNew<Boolean>(fAlreadyHave));
        item->Set(NanNew<String>("hash"), NanNew<String>(inv.hash.GetHex()));
        item->Set(NanNew<String>("type"), NanNew<String>(
          inv.type == MSG_BLOCK || inv.type == MSG_FILTERED_BLOCK
          ? "block" : "tx"));
        if (inv.type == MSG_FILTERED_BLOCK) {
          item->Set(NanNew<String>("filtered"), NanNew<Boolean>(true));
        } else if (inv.type == MSG_BLOCK) {
          item->Set(NanNew<String>("filtered"), NanNew<Boolean>(false));
        }

        array->Set(i, item);
        i++;
      }

      o->Set(NanNew<String>("items"), array);
    } else if (strCommand == "getdata") {
      vector<CInv> vInv;
      vRecv >> vInv;

      // Bad size
      if (vInv.size() > MAX_INV_SZ) {
        NanReturnValue(Undefined());
      }

      o->Set(NanNew<String>("size"), NanNew<Number>(vInv.size()));
      if (vInv.size() > 0) {
        o->Set(NanNew<String>("first"), NanNew<String>(vInv[0].ToString()));
      }
    } else if (strCommand == "getblocks") {
      CBlockLocator locator;
      uint256 hashStop;
      vRecv >> locator >> hashStop;

      LOCK(cs_main);

      // Find the last block the caller has in the main chain
      CBlockIndex* pindex = FindForkInGlobalIndex(chainActive, locator);

      // Send the rest of the chain
      if (pindex) {
        pindex = chainActive.Next(pindex);
      }

      o->Set(NanNew<String>("fromHeight"), NanNew<Number>(pindex ? pindex->nHeight : -1));
      o->Set(NanNew<String>("toHash"), NanNew<String>(
        hashStop == uint256(0) ? "end" : hashStop.GetHex()));
      o->Set(NanNew<String>("limit"), NanNew<Number>(500));
    } else if (strCommand == "getheaders") {
      CBlockLocator locator;
      uint256 hashStop;
      vRecv >> locator >> hashStop;

      LOCK(cs_main);

      CBlockIndex* pindex = NULL;
      if (locator.IsNull()) {
        // If locator is null, return the hashStop block
        BlockMap::iterator mi = mapBlockIndex.find(hashStop);
        if (mi == mapBlockIndex.end()) {
          NanReturnValue(obj);
        }
        pindex = (*mi).second;
      } else {
        // Find the last block the caller has in the main chain
        pindex = FindForkInGlobalIndex(chainActive, locator);
        if (pindex) {
          pindex = chainActive.Next(pindex);
        }
      }

      o->Set(NanNew<String>("fromHeight"), NanNew<Number>(pindex ? pindex->nHeight : -1));
      o->Set(NanNew<String>("toHash"), NanNew<String>(hashStop.GetHex()));
    } else if (strCommand == "tx") {
      // XXX May be able to do prev_list asynchronously
      // XXX Potentially check for "reject" in original code
      CTransaction tx;
      vRecv >> tx;
      Local<Object> jstx = NanNew<Object>();
      ctx_to_jstx(tx, 0, jstx);
      // ctx_to_jstx(tx, 0, o);
      o->Set(NanNew<String>("tx"), jstx);
    } else if (strCommand == "block" && !fImporting && !fReindex) {
      // XXX May be able to do prev_list asynchronously
      CBlock block;
      vRecv >> block;
      Local<Object> jsblock = NanNew<Object>();
      cblock_to_jsblock(block, NULL, jsblock, true);
      // cblock_to_jsblock(block, NULL, o, true);
      o->Set(NanNew<String>("block"), jsblock);
    } else if (strCommand == "getaddr") {
      ; // not much other information in getaddr as long as we know we got a getaddr
    } else if (strCommand == "mempool") {
      ; // not much other information in getaddr as long as we know we got a getaddr
    } else if (strCommand == "ping") {
      if (pfrom->nVersion > BIP0031_VERSION) {
        uint64_t nonce = 0;
        vRecv >> nonce;
        char sNonce[21] = {0};
        int written = snprintf(sNonce, sizeof(sNonce), "%020lu", (uint64_t)nonce);
        assert(written == 20);
        o->Set(NanNew<String>("nonce"), NanNew<String>(sNonce));
      } else {
        char sNonce[21] = {0};
        int written = snprintf(sNonce, sizeof(sNonce), "%020lu", (uint64_t)0);
        assert(written == 20);
        o->Set(NanNew<String>("nonce"), NanNew<String>(sNonce));
      }
    } else if (strCommand == "pong") {
      int64_t pingUsecEnd = nTimeReceived;
      uint64_t nonce = 0;
      size_t nAvail = vRecv.in_avail();
      bool bPingFinished = false;
      std::string sProblem;

      if (nAvail >= sizeof(nonce)) {
        vRecv >> nonce;

        // Only process pong message if there is an outstanding ping (old ping without nonce should never pong)
        if (pfrom->nPingNonceSent != 0) {
          if (nonce == pfrom->nPingNonceSent) {
            // Matching pong received, this ping is no longer outstanding
            bPingFinished = true;
            int64_t pingUsecTime = pingUsecEnd - pfrom->nPingUsecStart;
            if (pingUsecTime > 0) {
              // Successful ping time measurement, replace previous
              ;
            } else {
              // This should never happen
              sProblem = "Timing mishap";
            }
          } else {
            // Nonce mismatches are normal when pings are overlapping
            sProblem = "Nonce mismatch";
            if (nonce == 0) {
              // This is most likely a bug in another implementation somewhere, cancel this ping
              bPingFinished = true;
              sProblem = "Nonce zero";
            }
          }
        } else {
          sProblem = "Unsolicited pong without ping";
        }
      } else {
        // This is most likely a bug in another implementation somewhere, cancel this ping
        bPingFinished = true;
        sProblem = "Short payload";
      }

      char sNonce[21] = {0};
      int written = snprintf(sNonce, sizeof(sNonce), "%020lu", (uint64_t)nonce);
      assert(written == 20);

      char sPingNonceSent[21] = {0};
      written = snprintf(sPingNonceSent, sizeof(sPingNonceSent), "%020lu", (uint64_t)pfrom->nPingNonceSent);
      assert(written == 20);

      o->Set(NanNew<String>("expected"), NanNew<String>(sPingNonceSent));
      o->Set(NanNew<String>("received"), NanNew<String>(sNonce));
      o->Set(NanNew<String>("bytes"), NanNew<Number>((unsigned int)nAvail));

      if (!(sProblem.empty())) {
        o->Set(NanNew<String>("problem"), NanNew<String>(sProblem));
      }

      if (bPingFinished) {
        o->Set(NanNew<String>("finished"), NanNew<Boolean>(true));
      } else {
        o->Set(NanNew<String>("finished"), NanNew<Boolean>(false));
      }
    } else if (strCommand == "alert") {
      CAlert alert;
      vRecv >> alert;

      uint256 alertHash = alert.GetHash();

      o->Set(NanNew<String>("hash"), NanNew<String>(alertHash.GetHex()));

      if (pfrom->setKnown.count(alertHash) == 0) {
        if (alert.ProcessAlert()) {
          std::string vchMsg(alert.vchMsg.begin(), alert.vchMsg.end());
          std::string vchSig(alert.vchSig.begin(), alert.vchSig.end());
          o->Set(NanNew<String>("message"), NanNew<String>(vchMsg));
          o->Set(NanNew<String>("signature"), NanNew<String>(vchSig));
          o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(false));
        } else {
          // Small DoS penalty so peers that send us lots of
          // duplicate/expired/invalid-signature/whatever alerts
          // eventually get banned.
          // This isn't a Misbehaving(100) (immediate ban) because the
          // peer might be an older or different implementation with
          // a different signature key, etc.
          o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(true));
        }
      }
    } else if (strCommand == "filterload") {
      CBloomFilter filter;
      vRecv >> filter;

      if (!filter.IsWithinSizeConstraints()) {
        // There is no excuse for sending a too-large filter
        o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(true));
      } else {
        LOCK(pfrom->cs_filter);
        filter.UpdateEmptyFull();

        //std::string svData(filter.vData.begin(), filter.vData.end());
        //char *cvData = svData.c_str();
        //int vDataHexLen = sizeof(char) * (strlen(cvData) * 2) + 1;
        //char *vDataHex = (char *)malloc(vDataHexLen);
        //int written = snprintf(vDataHex, vDataHexLen, "%x", cvData);
        //uint64_t dataHex;
        //sscanf(cvData, "%x", &dataHex);
        //// assert(written == vDataHexLen);
        //vDataHex[written] = '\0';

        //o->Set(NanNew<String>("data"), NanNew<String>(vDataHex));
        //free(vDataHex);
        //o->Set(NanNew<String>("full"), NanNew<Boolean>(filter.isFull));
        //o->Set(NanNew<String>("empty"), NanNew<Boolean>(filter.isEmpty));
        //o->Set(NanNew<String>("hashFuncs"), NanNew<Number>(filter.nHashFuncs));
        //o->Set(NanNew<String>("tweaks"), NanNew<Number>(filter.nTweak));
        //o->Set(NanNew<String>("flags"), NanNew<Number>(filter.nFlags));
        o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(false));
      }
    } else if (strCommand == "filteradd") {
      vector<unsigned char> vData;
      vRecv >> vData;

      // Nodes must NEVER send a data item > 520 bytes (the max size for a script data object,
      // and thus, the maximum size any matched object can have) in a filteradd message
      if (vData.size() > MAX_SCRIPT_ELEMENT_SIZE) {
        o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(true));
      } else {
        LOCK(pfrom->cs_filter);
        if (pfrom->pfilter) {
          //std::string svData(vData.begin(), vData.end());
          //char *cvData = svData.c_str();
          //int vDataHexLen = sizeof(char) * (strlen(cvData) * 2) + 1;
          //char *vDataHex = (char *)malloc(vDataHexLen);
          //int written = snprintf(vDataHex, vDataHexLen, "%x", cvData);
          //uint64_t dataHex;
          //sscanf(cvData, "%x", &dataHex);
          //// assert(written == vDataHexLen);
          //vDataHex[written] = '\0';

          //o->Set(NanNew<String>("data"), NanNew<String>(vDataHex));
          //free(vDataHex);
          o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(false));
        } else {
          o->Set(NanNew<String>("misbehaving"), NanNew<Boolean>(true));
        }
      }
    } else if (strCommand == "filterclear") {
      ; // nothing much to grab from this packet
    } else if (strCommand == "reject") {
      ; // nothing much to grab from this packet
    } else {
      o->Set(NanNew<String>("unknown"), NanNew<Boolean>(true));
    }

    // Update the last seen time for this node's address
    if (pfrom->fNetworkNode) {
      if (strCommand == "version"
          || strCommand == "addr"
          || strCommand == "inv"
          || strCommand == "getdata"
          || strCommand == "ping") {
        o->Set(NanNew<String>("connected"), NanNew<Boolean>(true));
      }
    }

    obj->Set(i, o);
    i++;

    if (cur == packets_queue_head) {
      packets_queue_head = NULL;
    }

    if (cur == packets_queue_tail) {
      packets_queue_tail = NULL;
    }

    next = cur->next;
    // delete cur->pfrom; // cleaned up on disconnect
    free(cur->strCommand);
    delete cur->vRecv;
    free(cur);
  }

  poll_packets_mutex.unlock();

  NanReturnValue(obj);
}

static void
hook_packets(CNodeSignals& nodeSignals) {
  nodeSignals.ProcessMessages.connect(&process_packets);
}

static void
unhook_packets(CNodeSignals& nodeSignals) {
  nodeSignals.ProcessMessages.disconnect(&process_packets);
}

static bool
process_packets(CNode* pfrom) {
  bool fOk = true;

  std::deque<CNetMessage>::iterator it = pfrom->vRecvMsg.begin();
  while (!pfrom->fDisconnect && it != pfrom->vRecvMsg.end()) {
    // Don't bother if send buffer is too full to respond anyway
    if (pfrom->nSendSize >= SendBufferSize()) {
      break;
    }

    // get next message
    CNetMessage& msg = *it;

    // end, if an incomplete message is found
    if (!msg.complete()) {
      break;
    }

    // at this point, any failure means we can delete the current message
    it++;

    // Scan for message start
    if (memcmp(msg.hdr.pchMessageStart,
        Params().MessageStart(), MESSAGE_START_SIZE) != 0) {
      fOk = false;
      break;
    }

    // Read header
    CMessageHeader& hdr = msg.hdr;
    if (!hdr.IsValid()) {
      continue;
    }
    string strCommand = hdr.GetCommand();

    // Message size
    unsigned int nMessageSize = hdr.nMessageSize;

    // Checksum
    CDataStream& vRecv = msg.vRecv;
    uint256 hash = Hash(vRecv.begin(), vRecv.begin() + nMessageSize);
    unsigned int nChecksum = 0;
    memcpy(&nChecksum, &hash, sizeof(nChecksum));
    if (nChecksum != hdr.nChecksum) {
      continue;
    }

    // Process message
    process_packet(pfrom, strCommand, vRecv, msg.nTime);
    boost::this_thread::interruption_point();

    break;
  }

  return fOk;
}

static bool
process_packet(CNode* pfrom, string strCommand, CDataStream& vRecv, int64_t nTimeReceived) {
  poll_packets_mutex.lock();

  poll_packets_list *cur = (poll_packets_list *)malloc(sizeof(poll_packets_list));
  if (!packets_queue_head) {
    packets_queue_head = cur;
    packets_queue_tail = cur;
  } else {
    packets_queue_tail->next = cur;
    packets_queue_tail = cur;
  }

  cur->pfrom = pfrom;
  // NOTE: Copy the data stream.
  CDataStream *vRecv_ = new CDataStream(vRecv.begin(), vRecv.end(), vRecv.GetType(), vRecv.GetVersion());
  cur->vRecv = vRecv_;
  cur->nTimeReceived = nTimeReceived;
  cur->strCommand = strdup(strCommand.c_str());
  cur->next = NULL;

  poll_packets_mutex.unlock();

  return true;
}

/**
 * WalletNewAddress()
 * bitcoindjs.walletNewAddress(options)
 * Create a new address in the global pwalletMain.
 */

NAN_METHOD(WalletNewAddress) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletNewAddress(options)");
  }

  // Parse the account first so we don't generate a key if there's an error
  Local<Object> options = Local<Object>::Cast(args[0]);
  String::Utf8Value name_(options->Get(NanNew<String>("name"))->ToString());
  std::string strAccount = std::string(*name_);

  if (!pwalletMain->IsLocked()) {
    // XXX Do this asynchronously
    pwalletMain->TopUpKeyPool();
  }

  // Generate a new key that is added to wallet
  CPubKey newKey;

  if (!pwalletMain->GetKeyFromPool(newKey)) {
    // return NanThrowError("Keypool ran out, please call keypoolrefill first");
    // Call to EnsureWalletIsUnlocked()
    if (pwalletMain->IsLocked()) {
      return NanThrowError("Please enter the wallet passphrase with walletpassphrase first.");
    }
    // XXX Do this asynchronously
    pwalletMain->TopUpKeyPool(100);
    if (pwalletMain->GetKeyPoolSize() < 100) {
      return NanThrowError("Error refreshing keypool.");
    }
  }

  CKeyID keyID = newKey.GetID();

  pwalletMain->SetAddressBook(keyID, strAccount, "receive");

  NanReturnValue(NanNew<String>(CBitcoinAddress(keyID).ToString()));
}

// NOTE: This function was ripped out of the bitcoin core source. It needed to
// be modified to fit v8's error handling.
CBitcoinAddress GetAccountAddress(std::string strAccount, bool bForceNew=false) {
  CWalletDB walletdb(pwalletMain->strWalletFile);

  CAccount account;
  walletdb.ReadAccount(strAccount, account);

  bool bKeyUsed = false;

  // Check if the current key has been used
  if (account.vchPubKey.IsValid()) {
    CScript scriptPubKey = GetScriptForDestination(account.vchPubKey.GetID());
    for (map<uint256, CWalletTx>::iterator it = pwalletMain->mapWallet.begin();
         it != pwalletMain->mapWallet.end() && account.vchPubKey.IsValid();
         ++it) {
      const CWalletTx& wtx = (*it).second;
      BOOST_FOREACH(const CTxOut& txout, wtx.vout) {
        if (txout.scriptPubKey == scriptPubKey) {
          bKeyUsed = true;
        }
      }
    }
  }

  // Generate a new key
  if (!account.vchPubKey.IsValid() || bForceNew || bKeyUsed) {
    if (!pwalletMain->GetKeyFromPool(account.vchPubKey)) {
      NanThrowError("Keypool ran out, please call keypoolrefill first");
      CBitcoinAddress addr;
      return addr;
    }
    pwalletMain->SetAddressBook(account.vchPubKey.GetID(), strAccount, "receive");
    walletdb.WriteAccount(strAccount, account);
  }

  return CBitcoinAddress(account.vchPubKey.GetID());
}

/**
 * WalletGetAccountAddress()
 * bitcoindjs.walletGetAccountAddress(options)
 * Return the address tied to a specific account name.
 */

NAN_METHOD(WalletGetAccountAddress) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletGetAccountAddress(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strAccount = std::string(EMPTY);

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  if (strAccount == EMPTY) {
    return NanThrowError("No account name provided.");
  }

  std::string ret = GetAccountAddress(strAccount).ToString();

  NanReturnValue(NanNew<String>(ret));
}

/**
 * WalletSetAccount()
 * bitcoindjs.walletSetAccount(options)
 * Return a new address if the account does not exist, or tie an account to an
 * address.
 */

NAN_METHOD(WalletSetAccount) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletSetAccount(options)");
  }

  // Parse the account first so we don't generate a key if there's an error
  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strAddress = std::string("");
  if (options->Get(NanNew<String>("address"))->IsString()) {
    String::Utf8Value address_(options->Get(NanNew<String>("address"))->ToString());
    strAddress = std::string(*address_);
  }

  CBitcoinAddress address;
  if (strAddress != "") {
    address = CBitcoinAddress(strAddress);
    if (!address.IsValid()) {
      return NanThrowError("Invalid Bitcoin address");
    }
  }

  std::string strAccount = std::string(EMPTY);

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  if (strAddress != "") {
    // If it isn't our address, create a recipient:
    {
      CTxDestination dest = address.Get();
      if (!IsMine(*pwalletMain, dest)) {
        pwalletMain->SetAddressBook(dest, strAccount, "send");
        pwalletMain->SetAddressBook(dest, strAccount, "send");
        NanReturnValue(Undefined());
      }
    }
    // Detect when changing the account of an address that is the 'unused current key' of another account:
    if (pwalletMain->mapAddressBook.count(address.Get())) {
      string strOldAccount = pwalletMain->mapAddressBook[address.Get()].name;
      if (address == GetAccountAddress(strOldAccount)) {
        GetAccountAddress(strOldAccount, true);
      }
      pwalletMain->SetAddressBook(address.Get(), strAccount, "receive");
    }
  } else {
    // Generate a new key that is added to wallet
    CPubKey newKey;

    if (!pwalletMain->GetKeyFromPool(newKey)) {
      // return NanThrowError("Keypool ran out, please call keypoolrefill first");
      // Call to EnsureWalletIsUnlocked()
      if (pwalletMain->IsLocked()) {
        return NanThrowError("Please enter the wallet passphrase with walletpassphrase first.");
      }
      // XXX Do this asynchronously
      pwalletMain->TopUpKeyPool(100);
      if (pwalletMain->GetKeyPoolSize() < 100) {
        return NanThrowError("Error refreshing keypool.");
      }
    }

    CKeyID keyID = newKey.GetID();

    pwalletMain->SetAddressBook(keyID, strAccount, "receive");
  }


  NanReturnValue(Undefined());
}

/**
 * WalletGetAccount()
 * bitcoindjs.walletGetAccount(options)
 * Get an account name based on address.
 */

NAN_METHOD(WalletGetAccount) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletGetAccount(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value address_(options->Get(NanNew<String>("address"))->ToString());
  std::string strAddress = std::string(*address_);

  CBitcoinAddress address(strAddress);
  if (!address.IsValid()) {
    return NanThrowError("Invalid Bitcoin address");
  }

  std::string strAccount;
  map<CTxDestination, CAddressBookData>::iterator mi = pwalletMain->mapAddressBook.find(address.Get());
  if (mi != pwalletMain->mapAddressBook.end() && !(*mi).second.name.empty()) {
    strAccount = (*mi).second.name;
  }

  NanReturnValue(NanNew<String>(strAccount));
}

/**
 * WalletGetRecipients()
 * bitcoindjs.walletGetRecipients()
 * Get all recipients
 */

NAN_METHOD(WalletGetRecipients) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletGetRecipients(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  Local<Array> array = NanNew<Array>();
  int i = 0;

  BOOST_FOREACH(const PAIRTYPE(CBitcoinAddress, CAddressBookData)& item, pwalletMain->mapAddressBook) {
    const CBitcoinAddress& address = item.first;
    const string& strName = item.second.name;
    if (item.second.purpose == "send" && address.IsValid()) {
      Local<Object> recipient = NanNew<Object>();
      recipient->Set(NanNew<String>("label"), NanNew<String>(strName));
      recipient->Set(NanNew<String>("account"), NanNew<String>(strName));
      recipient->Set(NanNew<String>("name"), NanNew<String>(strName));
      recipient->Set(NanNew<String>("address"), NanNew<String>(address.ToString()));
      array->Set(i, recipient);
      i++;
      if (options->Get(NanNew<String>("_label"))->IsString()) {
        break;
      }
    }
  }

  if (options->Get(NanNew<String>("_label"))->IsString()) {
    NanReturnValue(array->Get(0));
  }

  NanReturnValue(array);
}

/**
 * WalletSetRecipient()
 * bitcoindjs.walletSetRecipient()
 * Set a recipient
 */

NAN_METHOD(WalletSetRecipient) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletSetRecipient(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
  std::string addr = std::string(*addr_);

  std::string strAccount = std::string(EMPTY);

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  if (strAccount == EMPTY) {
    return NanThrowError("No account name provided.");
  }

  CTxDestination address = CBitcoinAddress(addr).Get();
  pwalletMain->SetAddressBook(address, strAccount, "send");
  pwalletMain->SetAddressBook(address, strAccount, "send");

  NanReturnValue(True());
}

/**
 * WalletRemoveRecipient()
 * bitcoindjs.walletRemoveRecipient()
 * Remove a recipient
 */

NAN_METHOD(WalletRemoveRecipient) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletRemoveRecipient(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
  std::string addr = std::string(*addr_);

  CTxDestination address = CBitcoinAddress(addr).Get();

  pwalletMain->DelAddressBook(address);

  NanReturnValue(True());
}

/**
 * WalletSendTo()
 * bitcoindjs.walletSendTo(options)
 * Send bitcoin to an address, automatically creating the transaction based on
 * availing unspent outputs.
 */

NAN_METHOD(WalletSendTo) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletSendTo(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  async_wallet_sendto_data *data = new async_wallet_sendto_data();

  data->err_msg = std::string("");

  String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
  std::string addr = std::string(*addr_);
  data->address = addr;

  // Amount
  int64_t nAmount = options->Get(NanNew<String>("amount"))->IntegerValue();
  data->nAmount = nAmount;

  // Wallet comments
  CWalletTx wtx;
  if (options->Get(NanNew<String>("comment"))->IsString()) {
    String::Utf8Value comment_(options->Get(NanNew<String>("comment"))->ToString());
    std::string comment = std::string(*comment_);
    wtx.mapValue["comment"] = comment;
  }
  if (options->Get(NanNew<String>("to"))->IsString()) {
    String::Utf8Value to_(options->Get(NanNew<String>("to"))->ToString());
    std::string to = std::string(*to_);
    wtx.mapValue["to"] = to;
  }
  data->wtx = wtx;

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_wallet_sendto,
    (uv_after_work_cb)async_wallet_sendto_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_wallet_sendto(uv_work_t *req) {
  async_wallet_sendto_data* data = static_cast<async_wallet_sendto_data*>(req->data);

  CBitcoinAddress address(data->address);

  if (!address.IsValid()) {
    data->err_msg = std::string("Invalid Bitcoin address");
    return;
  }

  // Amount
  int64_t nAmount = data->nAmount;

  // Wallet Transaction
  CWalletTx wtx = data->wtx;

  // Call to EnsureWalletIsUnlocked()
  if (pwalletMain->IsLocked()) {
    data->err_msg = std::string("Please enter the wallet passphrase with walletpassphrase first.");
    return;
  }

  std::string strError = pwalletMain->SendMoney(address.Get(), nAmount, wtx);
  if (strError != "") {
    data->err_msg = strError;
    return;
  }

  data->tx_hash = wtx.GetHash().GetHex();
}

static void
async_wallet_sendto_after(uv_work_t *req) {
  NanScope();
  async_wallet_sendto_data* data = static_cast<async_wallet_sendto_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->tx_hash))
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * WalletSendFrom()
 * bitcoindjs.walletSendFrom(options)
 * Send bitcoin to a particular address from a particular owned account name.
 * This once again automatically creates and signs a transaction based on any
 * unspent outputs available.
 */

NAN_METHOD(WalletSendFrom) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletSendFrom(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  async_wallet_sendfrom_data *data = new async_wallet_sendfrom_data();

  data->err_msg = std::string("");

  String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
  std::string addr = std::string(*addr_);
  data->address = addr;

  String::Utf8Value from_(options->Get(NanNew<String>("from"))->ToString());
  std::string from = std::string(*from_);
  std::string strAccount = from;

  int64_t nAmount = options->Get(NanNew<String>("amount"))->IntegerValue();
  data->nAmount = nAmount;

  int nMinDepth = 1;
  if (options->Get(NanNew<String>("minDepth"))->IsNumber()) {
    nMinDepth = options->Get(NanNew<String>("minDepth"))->IntegerValue();
  }
  data->nMinDepth = nMinDepth;

  CWalletTx wtx;
  wtx.strFromAccount = strAccount;
  if (options->Get(NanNew<String>("comment"))->IsString()) {
    String::Utf8Value comment_(options->Get(NanNew<String>("comment"))->ToString());
    std::string comment = std::string(*comment_);
    wtx.mapValue["comment"] = comment;
  }
  if (options->Get(NanNew<String>("to"))->IsString()) {
    String::Utf8Value to_(options->Get(NanNew<String>("to"))->ToString());
    std::string to = std::string(*to_);
    wtx.mapValue["to"] = to;
  }
  data->wtx = wtx;

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_wallet_sendfrom,
    (uv_after_work_cb)async_wallet_sendfrom_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_wallet_sendfrom(uv_work_t *req) {
  async_wallet_sendfrom_data* data = static_cast<async_wallet_sendfrom_data*>(req->data);

  CBitcoinAddress address(data->address);

  if (!address.IsValid()) {
    data->err_msg = std::string("Invalid Bitcoin address");
    return;
  }

  int64_t nAmount = data->nAmount;
  int nMinDepth = data->nMinDepth;
  CWalletTx wtx = data->wtx;
  std::string strAccount = data->wtx.strFromAccount;

  // Call to: EnsureWalletIsUnlocked()
  if (pwalletMain->IsLocked()) {
    data->err_msg = std::string("Please enter the wallet passphrase with walletpassphrase first.");
    return;
  }

  // Check funds
  double nBalance = (double)GetAccountBalance(strAccount, nMinDepth, ISMINE_SPENDABLE);
  if (((double)(nAmount * 1.0) / 100000000) > nBalance) {
    data->err_msg = std::string("Account has insufficient funds");
    return;
  }

  // Send
  std::string strError = pwalletMain->SendMoney(address.Get(), nAmount, wtx);
  if (strError != "") {
    data->err_msg = strError;
    return;
  }

  data->tx_hash = wtx.GetHash().GetHex();
}

static void
async_wallet_sendfrom_after(uv_work_t *req) {
  NanScope();
  async_wallet_sendfrom_data* data = static_cast<async_wallet_sendfrom_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->tx_hash))
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * WalletMove()
 * bitcoindjs.walletMove(options)
 * Move BTC from one account to another
 */

NAN_METHOD(WalletMove) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletMove(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strFrom;
  if (options->Get(NanNew<String>("from"))->IsString()) {
    String::Utf8Value s_(options->Get(NanNew<String>("from"))->ToString());
    strFrom = std::string(*s_);
  }

  std::string strTo;
  if (options->Get(NanNew<String>("to"))->IsString()) {
    String::Utf8Value s_(options->Get(NanNew<String>("to"))->ToString());
    strTo = std::string(*s_);
  }

  CAmount nAmount;
  if (options->Get(NanNew<String>("amount"))->IsNumber()) {
    nAmount = (CAmount)options->Get(NanNew<String>("amount"))->IntegerValue();
  }

  // DEPRECATED
  // int nMinDepth = 1;
  // if (options->Get(NanNew<String>("minDepth"))->IsNumber()) {
  //   nMinDepth = options->Get(NanNew<String>("minDepth"))->IntegerValue();
  // }

  std::string strComment;
  if (options->Get(NanNew<String>("comment"))->IsString()) {
    String::Utf8Value s_(options->Get(NanNew<String>("comment"))->ToString());
    strComment = std::string(*s_);
  }

  CWalletDB walletdb(pwalletMain->strWalletFile);
  if (!walletdb.TxnBegin()) {
    return NanThrowError("database error");
  }

  int64_t nNow = GetAdjustedTime();

  // Debit
  CAccountingEntry debit;
  debit.nOrderPos = pwalletMain->IncOrderPosNext(&walletdb);
  debit.strAccount = strFrom;
  debit.nCreditDebit = -nAmount;
  debit.nTime = nNow;
  debit.strOtherAccount = strTo;
  debit.strComment = strComment;
  walletdb.WriteAccountingEntry(debit);

  // Credit
  CAccountingEntry credit;
  credit.nOrderPos = pwalletMain->IncOrderPosNext(&walletdb);
  credit.strAccount = strTo;
  credit.nCreditDebit = nAmount;
  credit.nTime = nNow;
  credit.strOtherAccount = strFrom;
  credit.strComment = strComment;
  walletdb.WriteAccountingEntry(credit);

  if (!walletdb.TxnCommit()) {
    return NanThrowError("database error");
  }

  NanReturnValue(Undefined());
}

/**
 * WalletSignMessage()
 * bitcoindjs.walletSignMessage(options)
 * Sign any piece of text using a private key tied to an address.
 */

NAN_METHOD(WalletSignMessage) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletSignMessage(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value strAddress_(options->Get(NanNew<String>("address"))->ToString());
  std::string strAddress = std::string(*strAddress_);
  String::Utf8Value strMessage_(options->Get(NanNew<String>("message"))->ToString());
  std::string strMessage = std::string(*strMessage_);

  // Call to EnsureWalletIsUnlocked()
  if (pwalletMain->IsLocked()) {
    return NanThrowError("Please enter the wallet passphrase with walletpassphrase first.");
  }

  CBitcoinAddress addr(strAddress);
  if (!addr.IsValid()) {
    return NanThrowError("Invalid address");
  }

  CKeyID keyID;
  if (!addr.GetKeyID(keyID)) {
    return NanThrowError("Address does not refer to key");
  }

  CKey key;
  if (!pwalletMain->GetKey(keyID, key)) {
    return NanThrowError("Private key not available");
  }

  CHashWriter ss(SER_GETHASH, 0);
  ss << strMessageMagic;
  ss << strMessage;

  vector<unsigned char> vchSig;
  if (!key.SignCompact(ss.GetHash(), vchSig)) {
    return NanThrowError("Sign failed");
  }

  std::string result = EncodeBase64(&vchSig[0], vchSig.size());

  NanReturnValue(NanNew<String>(result));
}

/**
 * WalletVerifyMessage()
 * bitcoindjs.walletVerifyMessage(options)
 * Verify a signed message using any address' public key.
 */

NAN_METHOD(WalletVerifyMessage) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletVerifyMessage(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value strAddress_(options->Get(NanNew<String>("address"))->ToString());
  std::string strAddress = std::string(*strAddress_);

  String::Utf8Value strSign_(options->Get(NanNew<String>("signature"))->ToString());
  std::string strSign = std::string(*strSign_);

  String::Utf8Value strMessage_(options->Get(NanNew<String>("message"))->ToString());
  std::string strMessage = std::string(*strMessage_);

  CBitcoinAddress addr(strAddress);
  if (!addr.IsValid()) {
    return NanThrowError( "Invalid address");
  }

  CKeyID keyID;
  if (!addr.GetKeyID(keyID)) {
    return NanThrowError( "Address does not refer to key");
  }

  bool fInvalid = false;
  vector<unsigned char> vchSig = DecodeBase64(strSign.c_str(), &fInvalid);

  if (fInvalid) {
    return NanThrowError( "Malformed base64 encoding");
  }

  CHashWriter ss(SER_GETHASH, 0);
  ss << strMessageMagic;
  ss << strMessage;

  CPubKey pubkey;
  if (!pubkey.RecoverCompact(ss.GetHash(), vchSig)) {
    NanReturnValue(NanNew<Boolean>(false));
  }

  NanReturnValue(NanNew<Boolean>(pubkey.GetID() == keyID));
}

/**
 * WalletCreateMultiSigAddress()
 * bitcoindjs.walletCreateMultiSigAddress(options)
 * Create a multisig address for the global wallet.
 */

CScript _createmultisig_redeemScript(int nRequired, Local<Array> keys) {
  // Gather public keys
  if (nRequired < 1) {
    throw runtime_error("a multisignature address must require at least one key to redeem");
  }
  if ((int)keys->Length() < nRequired) {
    NanThrowError("not enough keys supplied");
    CScript s;
    return s;
  }
  std::vector<CPubKey> pubkeys;
  pubkeys.resize(keys->Length());
  for (unsigned int i = 0; i < keys->Length(); i++) {
    String::Utf8Value key_(keys->Get(i)->ToString());
    const std::string& ks = std::string(*key_);
#ifdef ENABLE_WALLET
    // Case 1: Bitcoin address and we have full public key:
    CBitcoinAddress address(ks);
    if (pwalletMain && address.IsValid()) {
      CKeyID keyID;
      if (!address.GetKeyID(keyID)) {
        NanThrowError("does not refer to a key");
        CScript s;
        return s;
      }
      CPubKey vchPubKey;
      if (!pwalletMain->GetPubKey(keyID, vchPubKey)) {
        NanThrowError("no full public key for address");
        CScript s;
        return s;
      }
      if (!vchPubKey.IsFullyValid()) {
        NanThrowError("Invalid public key");
        CScript s;
        return s;
      }
      pubkeys[i] = vchPubKey;
    }

    // Case 2: hex public key
    else
#endif
    if (IsHex(ks)) {
      CPubKey vchPubKey(ParseHex(ks));
      if (!vchPubKey.IsFullyValid()) {
        NanThrowError("Invalid public key");
        CScript s;
        return s;
      }
      pubkeys[i] = vchPubKey;
    } else {
      NanThrowError("Invalid public key");
      CScript s;
      return s;
    }
  }
  CScript result = GetScriptForMultisig(nRequired, pubkeys);

  if (result.size() > MAX_SCRIPT_ELEMENT_SIZE) {
    NanThrowError("redeemScript exceeds size limit");
    CScript s;
    return s;
  }

  return result;
}

NAN_METHOD(WalletCreateMultiSigAddress) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletCreateMultiSigAddress(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  int nRequired = options->Get(NanNew<String>("nRequired"))->IntegerValue();
  Local<Array> keys = Local<Array>::Cast(options->Get(NanNew<String>("keys")));

  // Gather public keys
  if (nRequired < 1) {
    return NanThrowError(
      "a multisignature address must require at least one key to redeem");
  }
  if ((int)keys->Length() < nRequired) {
    char s[150] = {0};
    snprintf(s, sizeof(s),
      "not enough keys supplied (got %u keys, but need at least %u to redeem)",
      keys->Length(), nRequired);
    NanThrowError(s);
    NanReturnValue(Undefined());
  }

  CScript inner = _createmultisig_redeemScript(nRequired, keys);

  // Construct using pay-to-script-hash:
  CScriptID innerID = inner.GetID();
  CBitcoinAddress address(innerID);

  Local<Object> result = NanNew<Object>();
  result->Set(NanNew<String>("address"), NanNew<String>(address.ToString()));
  result->Set(NanNew<String>("redeemScript"), NanNew<String>(HexStr(inner.begin(), inner.end())));

  NanReturnValue(result);
}

/**
 * WalletGetBalance()
 * bitcoindjs.walletGetBalance(options)
 * Get total balance of global wallet in satoshies in a javascript Number (up
 * to 64 bits, only 32 if bitwise ops or floating point are used unfortunately.
 * Obviously floating point is not necessary for satoshies).
 */

NAN_METHOD(WalletGetBalance) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletGetBalance(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strAccount = std::string(EMPTY);
  int nMinDepth = 1;

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("nMinDepth"))->IsNumber()) {
    nMinDepth = options->Get(NanNew<String>("nMinDepth"))->IntegerValue();
  }

  if (strAccount == EMPTY) {
    return NanThrowError("No account name provided.");
  }

  if (strAccount == "*") {
    // Calculate total balance a different way from GetBalance()
    // (GetBalance() sums up all unspent TxOuts)
    // getbalance and getbalance '*' 0 should return the same number
    int64_t nBalance = 0;
    for (map<uint256, CWalletTx>::iterator it = pwalletMain->mapWallet.begin();
        it != pwalletMain->mapWallet.end(); ++it) {
      const CWalletTx& wtx = (*it).second;

      if (!wtx.IsTrusted() || wtx.GetBlocksToMaturity() > 0) {
        continue;
      }

      int64_t allFee;
      string strSentAccount;
      list<pair<CTxDestination, int64_t> > listReceived;
      list<pair<CTxDestination, int64_t> > listSent;
      // With v0.9.0
      // wtx.GetAmounts(listReceived, listSent, allFee, strSentAccount);
      if (wtx.GetDepthInMainChain() >= nMinDepth) {
        BOOST_FOREACH(const PAIRTYPE(CTxDestination,int64_t)& r, listReceived) {
          nBalance += r.second;
        }
      }
      BOOST_FOREACH(const PAIRTYPE(CTxDestination,int64_t)& r, listSent) {
        nBalance -= r.second;
      }
      nBalance -= allFee;
    }
    NanReturnValue(NanNew<Number>(nBalance));
  }

  double nBalance = (double)GetAccountBalance(strAccount, nMinDepth, ISMINE_SPENDABLE);
  NanReturnValue(NanNew<Number>((int64_t)(nBalance * 100000000)));
}

/**
 * WalletGetUnconfirmedBalance()
 * bitcoindjs.walletGetUnconfirmedBalance(options)
 * Returns the unconfirmed balance in satoshies (including the transactions
 * that have not yet been included in any block).
 */

NAN_METHOD(WalletGetUnconfirmedBalance) {
  NanScope();
  NanReturnValue(NanNew<Number>(pwalletMain->GetUnconfirmedBalance()));
}

/**
 * WalletListTransactions()
 * bitcoindjs.walletListTransactions(options)
 * List all transactions pertaining to any owned addreses. NOT YET IMPLEMENTED>
 */

NAN_METHOD(WalletListTransactions) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletListTransactions(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strAccount = "*";

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  int nCount = 10;
  if (options->Get(NanNew<String>("count"))->IsNumber()) {
    nCount = (int)options->Get(NanNew<String>("count"))->IntegerValue();
  }

  int nFrom = 0;
  if (options->Get(NanNew<String>("from"))->IsNumber()) {
    nFrom = (int)options->Get(NanNew<String>("from"))->IntegerValue();
  }

  isminefilter filter = ISMINE_SPENDABLE;
  if (options->Get(NanNew<String>("spendable"))->IsBoolean()) {
    if (options->Get(NanNew<String>("spendable"))->ToBoolean()->IsTrue()) {
      filter = filter | ISMINE_WATCH_ONLY;
    }
  }

  if (nCount < 0) {
    return NanThrowError("Negative count");
  }

  if (nFrom < 0) {
    return NanThrowError("Negative from");
  }

  Local<Array> ret = NanNew<Array>();

  std::list<CAccountingEntry> acentries;
  CWallet::TxItems txOrdered = pwalletMain->OrderedTxItems(acentries, strAccount);

  // iterate backwards until we have nCount items to return:
  int a_count = 0;
  for (CWallet::TxItems::reverse_iterator it = txOrdered.rbegin();
      it != txOrdered.rend();
      ++it) {
    CWalletTx *const pwtx = (*it).second.first;
    if (pwtx != 0) {
      ListTransactions_V8(*pwtx, strAccount, 0, true, ret, filter);
    }
    CAccountingEntry *const pacentry = (*it).second.second;
    if (pacentry != 0) {
      AcentryToJSON_V8(*pacentry, strAccount, ret, a_count);
      a_count++;
    }
    if ((int)ret->Length() >= (nCount+nFrom)) {
      break;
    }
  }
  // ret is newest to oldest

  if (nFrom > (int)ret->Length()) {
    nFrom = ret->Length();
  }
  if ((nFrom + nCount) > (int)ret->Length()) {
    nCount = ret->Length() - nFrom;
  }

  // Array::iterator first = ret.begin();
  // std::advance(first, nFrom);
  // Array::iterator last = ret.begin();
  // std::advance(last, nFrom+nCount);
  //
  // if (last != ret.end()) {
  //   ret.erase(last, ret.end());
  // }
  // if (first != ret.begin()) {
  //   ret.erase(ret.begin(), first);
  // }
  //
  // std::reverse(ret.begin(), ret.end()); // Return oldest to newest

  NanReturnValue(ret);
}

static void
AcentryToJSON_V8(const CAccountingEntry& acentry,
                const string& strAccount, Local<Array>& ret, int a_count) {
  bool fAllAccounts = (strAccount == string("*"));

  if (fAllAccounts || acentry.strAccount == strAccount) {
    Local<Object> entry = NanNew<Object>();
    entry->Set(NanNew<String>("account"), NanNew<String>(acentry.strAccount));
    entry->Set(NanNew<String>("category"), NanNew<String>("move"));
    entry->Set(NanNew<String>("time"), NanNew<Number>(acentry.nTime));
    entry->Set(NanNew<String>("amount"), NanNew<Number>(acentry.nCreditDebit));
    entry->Set(NanNew<String>("otheraccount"), NanNew<String>(acentry.strOtherAccount));
    entry->Set(NanNew<String>("comment"), NanNew<String>(acentry.strComment));
    ret->Set(a_count, entry);
  }
}

static void
WalletTxToJSON_V8(const CWalletTx& wtx, Local<Object>& entry) {
  int confirms = wtx.GetDepthInMainChain();
  entry->Set(NanNew<String>("confirmations"), NanNew<Number>(confirms));
  if (wtx.IsCoinBase()) {
    entry->Set(NanNew<String>("generated"), NanNew<Boolean>(true));
  }
  if (confirms > 0) {
    entry->Set(NanNew<String>("blockhash"), NanNew<String>(wtx.hashBlock.GetHex()));
    entry->Set(NanNew<String>("blockindex"), NanNew<Number>(wtx.nIndex));
    entry->Set(NanNew<String>("blocktime"), NanNew<Number>(mapBlockIndex[wtx.hashBlock]->GetBlockTime()));
  }
  uint256 hash = wtx.GetHash();
  entry->Set(NanNew<String>("txid"), NanNew<String>(hash.GetHex()));
  Local<Array> conflicts = NanNew<Array>();
  int i = 0;
  BOOST_FOREACH(const uint256& conflict, wtx.GetConflicts()) {
    conflicts->Set(i, NanNew<String>(conflict.GetHex()));
    i++;
  }
  entry->Set(NanNew<String>("walletconflicts"), conflicts);
  entry->Set(NanNew<String>("time"), NanNew<Number>(wtx.GetTxTime()));
  entry->Set(NanNew<String>("timereceived"), NanNew<Number>((int64_t)wtx.nTimeReceived));
  BOOST_FOREACH(const PAIRTYPE(string,string)& item, wtx.mapValue) {
    entry->Set(NanNew<String>(item.first), NanNew<String>(item.second));
  }
}

static void
MaybePushAddress_V8(Local<Object>& entry, const CTxDestination &dest) {
  CBitcoinAddress addr;
  if (addr.Set(dest)) {
    entry->Set(NanNew<String>("address"), NanNew<String>(addr.ToString()));
  }
}

static void
ListTransactions_V8(const CWalletTx& wtx, const string& strAccount,
                  int nMinDepth, bool fLong, Local<Array> ret,
                  const isminefilter& filter) {
  CAmount nFee;
  string strSentAccount;
  list<COutputEntry> listReceived;
  list<COutputEntry> listSent;

  wtx.GetAmounts(listReceived, listSent, nFee, strSentAccount, filter);

  bool fAllAccounts = (strAccount == string("*"));
  bool involvesWatchonly = wtx.IsFromMe(ISMINE_WATCH_ONLY);

  int i = 0;
  // Sent
  if ((!listSent.empty() || nFee != 0) && (fAllAccounts || strAccount == strSentAccount)) {
    BOOST_FOREACH(const COutputEntry& s, listSent) {
      Local<Object> entry = NanNew<Object>();
      if (involvesWatchonly || (::IsMine(*pwalletMain, s.destination) & ISMINE_WATCH_ONLY)) {
        entry->Set(NanNew<String>("involvesWatchonly"), NanNew<Boolean>(true));
      }
      entry->Set(NanNew<String>("account"), NanNew<String>(strSentAccount));
      MaybePushAddress_V8(entry, s.destination);
      entry->Set(NanNew<String>("category"), NanNew<String>("send"));
      entry->Set(NanNew<String>("amount"), NanNew<Number>(-s.amount));
      entry->Set(NanNew<String>("vout"), NanNew<Number>(s.vout));
      entry->Set(NanNew<String>("fee"), NanNew<Number>(-nFee));
      if (fLong) {
        WalletTxToJSON_V8(wtx, entry);
      }
      ret->Set(i, entry);
      i++;
    }
  }

  i = 0;
  // Received
  if (listReceived.size() > 0 && wtx.GetDepthInMainChain() >= nMinDepth) {
    BOOST_FOREACH(const COutputEntry& r, listReceived) {
      string account;
      if (pwalletMain->mapAddressBook.count(r.destination)) {
        account = pwalletMain->mapAddressBook[r.destination].name;
      }
      if (fAllAccounts || (account == strAccount)) {
        Local<Object> entry = NanNew<Object>();
        if(involvesWatchonly || (::IsMine(*pwalletMain, r.destination) & ISMINE_WATCH_ONLY)) {
          entry->Set(NanNew<String>("involvesWatchonly"), NanNew<Boolean>(true));
        }
        entry->Set(NanNew<String>("account"), NanNew<String>(account));
        MaybePushAddress_V8(entry, r.destination);
        if (wtx.IsCoinBase()) {
          if (wtx.GetDepthInMainChain() < 1) {
            entry->Set(NanNew<String>("category"), NanNew<String>("orphan"));
          } else if (wtx.GetBlocksToMaturity() > 0) {
            entry->Set(NanNew<String>("category"), NanNew<String>("immature"));
          } else {
            entry->Set(NanNew<String>("category"), NanNew<String>("generate"));
          }
        } else {
          entry->Set(NanNew<String>("category"), NanNew<String>("receive"));
        }
        entry->Set(NanNew<String>("amount"), NanNew<Number>(r.amount));
        // XXX What is COutputEntry::vout?
        // entry->Set(NanNew<String>("vout"), NanNew<Number>(r.vout));
        if (fLong) {
          WalletTxToJSON_V8(wtx, entry);
        }
        ret->Set(i, entry);
        i++;
      }
    }
  }
}

/**
 * WalletReceivedByAddress()
 * bitcoindjs.walletReceivedByAddress(options)
 * List all transactions pertaining to any owned addreses. NOT YET IMPLEMENTED>
 */

NAN_METHOD(WalletReceivedByAddress) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletReceivedByAddress(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
  std::string addr = std::string(*addr_);

  // Bitcoin address
  CBitcoinAddress address = CBitcoinAddress(addr);
  if (!address.IsValid()) {
    return NanThrowError("Invalid Bitcoin address");
  }
  CScript scriptPubKey = GetScriptForDestination(address.Get());

  if (!IsMine(*pwalletMain, scriptPubKey)) {
    NanReturnValue(NanNew<Number>((double)0.0));
  }

  // Minimum confirmations
  int nMinDepth = 1;
  if (options->Get(NanNew<String>("confirmations"))->IsNumber()) {
    nMinDepth = (int)options->Get(NanNew<String>("confirmations"))->IntegerValue();
  }

  // Tally
  CAmount nAmount = 0;
  for (map<uint256, CWalletTx>::iterator it = pwalletMain->mapWallet.begin();
      it != pwalletMain->mapWallet.end();
      ++it) {
    const CWalletTx& wtx = (*it).second;
    if (wtx.IsCoinBase() || !IsFinalTx(wtx)) {
      continue;
    }
    BOOST_FOREACH(const CTxOut& txout, wtx.vout) {
      if (txout.scriptPubKey == scriptPubKey) {
        if (wtx.GetDepthInMainChain() >= nMinDepth) {
          nAmount += txout.nValue;
        }
      }
    }
  }

  NanReturnValue(NanNew<Number>((int64_t)nAmount));
}

/**
 * WalletListAccounts()
 * bitcoindjs.walletListAccounts(options)
 * This will list all accounts, addresses, balanced, private keys, public keys,
 * and whether these keys are in compressed format. TODO: Only output private
 * keys if wallet is decrypted.
 */

NAN_METHOD(WalletListAccounts) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletListAccounts(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  int nMinDepth = 1;
  if (options->Get(NanNew<String>("minDepth"))->IsNumber()) {
    nMinDepth = options->Get(NanNew<String>("minDepth"))->IntegerValue();
  }

  isminefilter includeWatchonly = ISMINE_SPENDABLE;

  map<string, int64_t> mapAccountBalances;
  BOOST_FOREACH(const PAIRTYPE(CTxDestination, CAddressBookData)& entry, pwalletMain->mapAddressBook) {
    if (IsMine(*pwalletMain, entry.first) & includeWatchonly) { // This address belongs to me
      mapAccountBalances[entry.second.name] = 0;
    }
  }

  for (map<uint256, CWalletTx>::iterator it = pwalletMain->mapWallet.begin();
      it != pwalletMain->mapWallet.end(); ++it) {
    const CWalletTx& wtx = (*it).second;
    CAmount nFee;
    std::string strSentAccount;
    list<COutputEntry> listReceived;
    list<COutputEntry> listSent;
    int nDepth = wtx.GetDepthInMainChain();
    if (wtx.GetBlocksToMaturity() > 0 || nDepth < 0) {
      continue;
    }
    wtx.GetAmounts(listReceived, listSent, nFee, strSentAccount, includeWatchonly);
    mapAccountBalances[strSentAccount] -= nFee;
    BOOST_FOREACH(const COutputEntry& s, listSent) {
      mapAccountBalances[strSentAccount] -= s.amount;
    }
    if (nDepth >= nMinDepth) {
      BOOST_FOREACH(const COutputEntry& r, listReceived) {
        if (pwalletMain->mapAddressBook.count(r.destination)) {
          mapAccountBalances[pwalletMain->mapAddressBook[r.destination].name] += r.amount;
        } else {
          mapAccountBalances[""] += r.amount;
        }
      }
    }
  }

  list<CAccountingEntry> acentries;
  CWalletDB(pwalletMain->strWalletFile).ListAccountCreditDebit("*", acentries);
  BOOST_FOREACH(const CAccountingEntry& entry, acentries) {
    mapAccountBalances[entry.strAccount] += entry.nCreditDebit;
  }

  Local<Object> obj = NanNew<Object>();
  BOOST_FOREACH(const PAIRTYPE(string, int64_t)& accountBalance, mapAccountBalances) {
    Local<Object> entry = NanNew<Object>();
    entry->Set(NanNew<String>("balance"), NanNew<Number>(accountBalance.second));
    Local<Array> addr = NanNew<Array>();
    int i = 0;
    BOOST_FOREACH(const PAIRTYPE(CBitcoinAddress, CAddressBookData)& item, pwalletMain->mapAddressBook) {
      const CBitcoinAddress& address = item.first;
      const std::string& strName = item.second.name;
      if (strName == accountBalance.first && item.second.purpose != "send") {
        Local<Object> a = NanNew<Object>();
        a->Set(NanNew<String>("address"), NanNew<String>(address.ToString()));

        CKeyID keyID;
        if (!address.GetKeyID(keyID)) {
          return NanThrowError("Address does not refer to a key");
        }
        CKey vchSecret;
        if (!pwalletMain->GetKey(keyID, vchSecret)) {
          return NanThrowError("Private key for address is not known");
        }

        if (!pwalletMain->IsLocked()) {
          std::string priv = CBitcoinSecret(vchSecret).ToString();
          a->Set(NanNew<String>("privkeycompressed"), NanNew<Boolean>(vchSecret.IsCompressed()));
          a->Set(NanNew<String>("privkey"), NanNew<String>(priv));
        }

        CPubKey vchPubKey;
        pwalletMain->GetPubKey(keyID, vchPubKey);
        a->Set(NanNew<String>("pubkeycompressed"), NanNew<Boolean>(vchPubKey.IsCompressed()));
        a->Set(NanNew<String>("pubkey"), NanNew<String>(HexStr(vchPubKey)));

        addr->Set(i, a);
        i++;
      }
    }
    entry->Set(NanNew<String>("addresses"), addr);
    entry->Set(NanNew<String>("account"), NanNew<String>(accountBalance.first));
    entry->Set(NanNew<String>("name"), NanNew<String>(accountBalance.first));
    entry->Set(NanNew<String>("label"), NanNew<String>(accountBalance.first));
    obj->Set(NanNew<String>(accountBalance.first), entry);
  }

  NanReturnValue(obj);
}

/**
 * WalletGetTransaction()
 * bitcoindjs.walletGetTransaction(options)
 * Get any transaction pertaining to any owned addresses. NOT YET IMPLEMENTED.
 * XXX TODO
 */

NAN_METHOD(WalletGetTransaction) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletGetTransaction(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  if (options->Get(NanNew<String>("txid"))->IsString()) {
    String::Utf8Value txid_(options->Get(NanNew<String>("txid"))->ToString());
    std::string txid = std::string(*txid_);
    NanReturnValue(NanNew<String>(txid));
  }

  NanReturnValue(Undefined());
}

/**
 * WalletBackup()
 * bitcoindjs.walletBackup(options)
 * Backup the bdb wallet.dat to a particular location on filesystem.
 */

NAN_METHOD(WalletBackup) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletBackup(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value path_(options->Get(NanNew<String>("path"))->ToString());
  std::string strDest = std::string(*path_);

  if (!BackupWallet(*pwalletMain, strDest)) {
    return NanThrowError("Error: Wallet backup failed!");
  }

  NanReturnValue(Undefined());
}

/**
 * WalletPassphrase()
 * bitcoindjs.walletPassphrase(options)
 * Unlock wallet if encrypted already.
 */

NAN_METHOD(WalletPassphrase) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletPassphrase(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value passphrase_(options->Get(NanNew<String>("passphrase"))->ToString());
  std::string strPassphrase = std::string(*passphrase_);

  if (!pwalletMain->IsCrypted()) {
    return NanThrowError("Error: running with an unencrypted wallet, but walletpassphrase was called.");
  }

  SecureString strWalletPass;
  strWalletPass.reserve(100);
  strWalletPass = strPassphrase.c_str();

  if (strWalletPass.length() > 0) {
    if (!pwalletMain->Unlock(strWalletPass)) {
      return NanThrowError("Error: The wallet passphrase entered was incorrect.");
    }
  } else {
    return NanThrowError(
      "walletpassphrase <passphrase> <timeout>\n"
      "Stores the wallet decryption key in memory for <timeout> seconds.");
  }

  // XXX Do this asynchronously
  pwalletMain->TopUpKeyPool();

  NanReturnValue(Undefined());
}

/**
 * WalletPassphraseChange()
 * bitcoindjs.walletPassphraseChange(options)
 * Change the current passphrase for the encrypted wallet.
 */

NAN_METHOD(WalletPassphraseChange) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletPassphraseChange(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value oldPass_(options->Get(NanNew<String>("oldPass"))->ToString());
  std::string oldPass = std::string(*oldPass_);

  String::Utf8Value newPass_(options->Get(NanNew<String>("newPass"))->ToString());
  std::string newPass = std::string(*newPass_);

  if (!pwalletMain->IsCrypted()) {
    return NanThrowError("Error: running with an unencrypted wallet, but walletpassphrasechange was called.");
  }

  SecureString strOldWalletPass;
  strOldWalletPass.reserve(100);
  strOldWalletPass = oldPass.c_str();

  SecureString strNewWalletPass;
  strNewWalletPass.reserve(100);
  strNewWalletPass = newPass.c_str();

  if (strOldWalletPass.length() < 1 || strNewWalletPass.length() < 1) {
    return NanThrowError(
      "walletpassphrasechange <oldpassphrase> <newpassphrase>\n"
      "Changes the wallet passphrase from <oldpassphrase> to <newpassphrase>.");
  }

  if (!pwalletMain->ChangeWalletPassphrase(strOldWalletPass, strNewWalletPass)) {
    return NanThrowError("Error: The wallet passphrase entered was incorrect.");
  }

  NanReturnValue(Undefined());
}

/**
 * WalletLock()
 * bitcoindjs.walletLock(options)
 * Forget the encrypted wallet passphrase and lock the wallet once again.
 */

NAN_METHOD(WalletLock) {
  NanScope();

  if (args.Length() < 0) {
    return NanThrowError(
      "Usage: bitcoindjs.walletLock([options])");
  }

  if (!pwalletMain->IsCrypted()) {
    return NanThrowError("Error: running with an unencrypted wallet, but walletlock was called.");
  }

  pwalletMain->Lock();

  NanReturnValue(Undefined());
}

/**
 * WalletEncrypt()
 * bitcoindjs.walletEncrypt(options)
 * Encrypt the global wallet with a particular passphrase. Requires restarted
 * because Berkeley DB is bad.
 */

NAN_METHOD(WalletEncrypt) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletEncrypt(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  String::Utf8Value passphrase_(options->Get(NanNew<String>("passphrase"))->ToString());
  std::string strPass = std::string(*passphrase_);

  if (pwalletMain->IsCrypted()) {
    return NanThrowError("Error: running with an encrypted wallet, but encryptwallet was called.");
  }

  SecureString strWalletPass;
  strWalletPass.reserve(100);
  strWalletPass = strPass.c_str();

  if (strWalletPass.length() < 1) {
    return NanThrowError(
      "encryptwallet <passphrase>\n"
      "Encrypts the wallet with <passphrase>.");
  }

  if (!pwalletMain->EncryptWallet(strWalletPass)) {
    return NanThrowError("Error: Failed to encrypt the wallet.");
  }

  // BDB seems to have a bad habit of writing old data into
  // slack space in .dat files; that is bad if the old data is
  // unencrypted private keys. So:
  StartShutdown();

  printf(
    "bitcoind.js:"
    " wallet encrypted; bitcoind.js stopping,"
    " restart to run with encrypted wallet."
    " The keypool has been flushed, you need"
    " to make a new backup.\n"
  );

  NanReturnValue(Undefined());
}

/**
 * WalletEncrypted()
 * bitcoindjs.walletEncrypted()
 * Check whether the wallet is encrypted.
 */

NAN_METHOD(WalletEncrypted) {
  NanScope();

  if (args.Length() > 0) {
    return NanThrowError(
      "Usage: bitcoindjs.walletEncrypted()");
  }

  bool isLocked = false;
  bool isEncrypted = false;

  isEncrypted = pwalletMain->IsCrypted();

  if (isEncrypted) {
    isLocked = pwalletMain->IsLocked();
  }

  Local<Object> result = NanNew<Object>();
  result->Set(NanNew<String>("locked"), NanNew<Boolean>(isLocked));
  result->Set(NanNew<String>("encrypted"), NanNew<Boolean>(isEncrypted));

  NanReturnValue(result);
}

/**
 * WalletKeyPoolRefill()
 * bitcoindjs.walletKeyPoolRefill(options)
 * Refill key pool
 */

NAN_METHOD(WalletKeyPoolRefill) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletKeyPoolRefill(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  // 0 is interpreted by TopUpKeyPool() as the default keypool size given by -keypool
  unsigned int kpSize = 0;
  if (options->Get(NanNew<String>("size"))->IsNumber()) {
    kpSize = (unsigned int)options->Get(NanNew<String>("size"))->IntegerValue();
  }

  // EnsureWalletIsUnlocked();
  if (pwalletMain->IsLocked()) {
    return NanThrowError("Please enter the wallet passphrase with walletpassphrase first.");
  }
  // XXX Do this asynchronously
  pwalletMain->TopUpKeyPool(kpSize);

  if (pwalletMain->GetKeyPoolSize() < kpSize) {
    return NanThrowError("Error refreshing keypool.");
  }

  NanReturnValue(True());
}

/**
 * WalletSetTxFee()
 * bitcoindjs.walletSetTxFee(options)
 * Set default global wallet transaction fee internally.
 */

NAN_METHOD(WalletSetTxFee) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletSetTxFee(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  int64_t fee = options->Get(NanNew<String>("fee"))->IntegerValue();

  // Amount
  CAmount nAmount = 0;
  if (fee != 0.0) {
    nAmount = fee;
  }

  payTxFee = CFeeRate(nAmount, 1000);

  NanReturnValue(True());
}

/**
 * WalletDumpKey()
 * bitcoindjs.walletDumpKey(options)
 * Dump private key
 */

NAN_METHOD(WalletDumpKey) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletDumpKey(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);
  String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
  std::string addr = std::string(*addr_);

  CBitcoinAddress address(addr);

  Local<Object> obj = NanNew<Object>();
  obj->Set(NanNew<String>("address"), NanNew<String>(address.ToString()));

  CKeyID keyID;
  if (!address.GetKeyID(keyID)) {
    return NanThrowError("Address does not refer to a key");
  }
  CKey vchSecret;
  if (!pwalletMain->GetKey(keyID, vchSecret)) {
    return NanThrowError("Private key for address is not known");
  }

  if (!pwalletMain->IsCrypted()) {
    std::string priv = CBitcoinSecret(vchSecret).ToString();
    obj->Set(NanNew<String>("privkeycompressed"), NanNew<Boolean>(vchSecret.IsCompressed()));
    obj->Set(NanNew<String>("privkey"), NanNew<String>(priv));
  }

  CPubKey vchPubKey;
  pwalletMain->GetPubKey(keyID, vchPubKey);
  obj->Set(NanNew<String>("pubkeycompressed"), NanNew<Boolean>(vchPubKey.IsCompressed()));
  obj->Set(NanNew<String>("pubkey"), NanNew<String>(HexStr(vchPubKey)));

  NanReturnValue(obj);
}

/**
 * WalletImportKey()
 * bitcoindjs.walletImportKey(options)
 * Import private key into global wallet using standard compressed bitcoind
 * format.
 */

NAN_METHOD(WalletImportKey) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletImportKey(options, callback)");
  }

  async_import_key_data *data = new async_import_key_data();

  data->err_msg = std::string("");
  data->fRescan = false;

  Local<Object> options = Local<Object>::Cast(args[0]);
  Local<Function> callback;

  if (args.Length() > 1 && args[1]->IsFunction()) {
    callback = Local<Function>::Cast(args[1]);
    data->callback = Persistent<Function>::New(callback);
  }

  std::string strSecret = "";
  std::string strAccount = std::string(EMPTY);

  String::Utf8Value key_(options->Get(NanNew<String>("key"))->ToString());
  strSecret = std::string(*key_);

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value label_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*label_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value label_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*label_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value label_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*label_);
  }

rescan:
  if (data->fRescan) {
    uv_work_t *req = new uv_work_t();
    req->data = data;
    int status = uv_queue_work(uv_default_loop(),
      req, async_import_key,
      (uv_after_work_cb)async_import_key_after);
    assert(status == 0);
    NanReturnValue(Undefined());
  }

  // Whether to perform rescan after import
  data->fRescan = args.Length() > 1 && args[1]->IsFunction()
    ? true
    : false;

  if (strAccount == EMPTY) {
    if (data->fRescan) {
      data->err_msg = std::string("No account name provided.");
      goto rescan;
    } else {
      return NanThrowError("No account name provided.");
    }
  }

  // Call to: EnsureWalletIsUnlocked()
  if (pwalletMain->IsLocked()) {
    if (data->fRescan) {
      data->err_msg = std::string("Please enter the wallet passphrase with walletpassphrase first.");
      goto rescan;
    } else {
      return NanThrowError("Please enter the wallet passphrase with walletpassphrase first.");
    }
  }

  CBitcoinSecret vchSecret;
  bool fGood = vchSecret.SetString(strSecret);

  if (!fGood) {
    if (data->fRescan) {
      data->err_msg = std::string("Invalid private key encoding");
      goto rescan;
    } else {
      return NanThrowError("Invalid private key encoding");
    }
  }

  CKey key = vchSecret.GetKey();
  if (!key.IsValid()) {
    if (data->fRescan) {
      data->err_msg = std::string("Private key outside allowed range");
      goto rescan;
    } else {
      return NanThrowError("Private key outside allowed range");
    }
  }

  CPubKey pubkey = key.GetPubKey();
  CKeyID vchAddress = pubkey.GetID();
  {
    LOCK2(cs_main, pwalletMain->cs_wallet);

    pwalletMain->MarkDirty();
    pwalletMain->SetAddressBook(vchAddress, strAccount, "receive");

    // Don't throw error in case a key is already there
    if (pwalletMain->HaveKey(vchAddress)) {
      NanReturnValue(Undefined());
    }

    pwalletMain->mapKeyMetadata[vchAddress].nCreateTime = 1;

    if (!pwalletMain->AddKeyPubKey(key, pubkey)) {
      if (data->fRescan) {
        data->err_msg = std::string("Error adding key to wallet");
        goto rescan;
      } else {
        return NanThrowError("Error adding key to wallet");
      }
    }

    // whenever a key is imported, we need to scan the whole chain
    pwalletMain->nTimeFirstKey = 1; // 0 would be considered 'no value'
  }

  if (data->fRescan) {
    uv_work_t *req = new uv_work_t();
    req->data = data;

    int status = uv_queue_work(uv_default_loop(),
      req, async_import_key,
      (uv_after_work_cb)async_import_key_after);

    assert(status == 0);
  }

  NanReturnValue(Undefined());
}

static void
async_import_key(uv_work_t *req) {
  async_import_key_data* data = static_cast<async_import_key_data*>(req->data);
  if (data->err_msg != "") {
    return;
  }
  if (data->fRescan) {
    // This may take a long time, do it on the libuv thread pool:
    pwalletMain->ScanForWalletTransactions(chainActive.Genesis(), true);
  }
}

static void
async_import_key_after(uv_work_t *req) {
  NanScope();
  async_import_key_data* data = static_cast<async_import_key_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(True())
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * WalletDumpWallet()
 * bitcoindjs.walletDumpWallet(options, callback)
 * Dump wallet to bitcoind plaintext format.
 */

NAN_METHOD(WalletDumpWallet) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsObject() || !args[1]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletDumpWallet(options, callback)");
  }

  async_dump_wallet_data *data = new async_dump_wallet_data();

  data->err_msg = std::string("");

  Local<Object> options = Local<Object>::Cast(args[0]);
  Local<Function> callback = Local<Function>::Cast(args[1]);

  String::Utf8Value path_(options->Get(NanNew<String>("path"))->ToString());
  std::string path = std::string(*path_);

  // Call to: EnsureWalletIsUnlocked()
  if (pwalletMain->IsLocked()) {
    data->err_msg = std::string("Please enter the wallet passphrase with walletpassphrase first.");
  }

  data->path = path;
  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_dump_wallet,
    (uv_after_work_cb)async_dump_wallet_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_dump_wallet(uv_work_t *req) {
  async_dump_wallet_data* data = static_cast<async_dump_wallet_data*>(req->data);

  if (data->err_msg != "") {
    return;
  }

  std::string path = data->path;

  ofstream file;
  file.open(path.c_str());
  if (!file.is_open()) {
    data->err_msg = std::string("Cannot open wallet dump file");
  }

  std::map<CKeyID, int64_t> mapKeyBirth;
  std::set<CKeyID> setKeyPool;
  pwalletMain->GetKeyBirthTimes(mapKeyBirth);
  pwalletMain->GetAllReserveKeys(setKeyPool);

  // sort time/key pairs
  std::vector<std::pair<int64_t, CKeyID> > vKeyBirth;
  for (std::map<CKeyID, int64_t>::const_iterator it = mapKeyBirth.begin();
      it != mapKeyBirth.end();
      it++) {
    vKeyBirth.push_back(std::make_pair(it->second, it->first));
  }
  mapKeyBirth.clear();
  std::sort(vKeyBirth.begin(), vKeyBirth.end());

  // produce output
  file << strprintf("# Wallet dump created by bitcoind.js %s (%s)\n",
    CLIENT_BUILD, CLIENT_DATE);
  file << strprintf("# * Created on %s\n", EncodeDumpTime(GetTime()));
  file << strprintf("# * Best block at time of backup was %i (%s),\n",
    chainActive.Height(), chainActive.Tip()->GetBlockHash().ToString());
  file << strprintf("#   mined on %s\n",
    EncodeDumpTime(chainActive.Tip()->GetBlockTime()));
  file << "\n";
  for (std::vector<std::pair<int64_t, CKeyID> >::const_iterator it = vKeyBirth.begin();
      it != vKeyBirth.end();
      it++) {
    const CKeyID &keyid = it->second;
    std::string strTime = EncodeDumpTime(it->first);
    std::string strAddr = CBitcoinAddress(keyid).ToString();
    CKey key;
    if (pwalletMain->GetKey(keyid, key)) {
      if (pwalletMain->mapAddressBook.count(keyid)) {
        file << strprintf("%s %s label=%s # addr=%s\n",
          CBitcoinSecret(key).ToString(),
          strTime,
          EncodeDumpString(pwalletMain->mapAddressBook[keyid].name),
          strAddr);
      } else if (setKeyPool.count(keyid)) {
        file << strprintf("%s %s reserve=1 # addr=%s\n",
          CBitcoinSecret(key).ToString(),
          strTime, strAddr);
      } else {
        file << strprintf("%s %s change=1 # addr=%s\n",
          CBitcoinSecret(key).ToString(),
          strTime, strAddr);
      }
    }
  }
  file << "\n";
  file << "# End of dump\n";
  file.close();
}

static void
async_dump_wallet_after(uv_work_t *req) {
  NanScope();
  async_dump_wallet_data* data = static_cast<async_dump_wallet_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->path))
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * WalletImportWallet()
 * bitcoindjs.walletImportWallet(options, callback)
 * Import bitcoind wallet from plaintext format.
 */

NAN_METHOD(WalletImportWallet) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsObject() || !args[1]->IsFunction()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletImportWallet(options, callback)");
  }

  async_import_wallet_data *data = new async_import_wallet_data();

  data->err_msg = std::string("");

  Local<Object> options = Local<Object>::Cast(args[0]);
  Local<Function> callback = Local<Function>::Cast(args[1]);

  String::Utf8Value path_(options->Get(NanNew<String>("path"))->ToString());
  std::string path = std::string(*path_);

  // Call to: EnsureWalletIsUnlocked()
  if (pwalletMain->IsLocked()) {
    data->err_msg = std::string("Please enter the wallet passphrase with walletpassphrase first.");
  }

  data->path = path;
  data->callback = Persistent<Function>::New(callback);

  uv_work_t *req = new uv_work_t();
  req->data = data;

  int status = uv_queue_work(uv_default_loop(),
    req, async_import_wallet,
    (uv_after_work_cb)async_import_wallet_after);

  assert(status == 0);

  NanReturnValue(Undefined());
}

static void
async_import_wallet(uv_work_t *req) {
  async_import_wallet_data* data = static_cast<async_import_wallet_data*>(req->data);

  std::string path = data->path;

  ifstream file;
  file.open(path.c_str(), std::ios::in | std::ios::ate);
  if (!file.is_open()) {
    data->err_msg = std::string("Cannot open wallet dump file");
  }

  int64_t nTimeBegin = chainActive.Tip()->GetBlockTime();

  bool fGood = true;

  int64_t nFilesize = std::max((int64_t)1, (int64_t)file.tellg());
  file.seekg(0, file.beg);

  pwalletMain->ShowProgress(_("Importing..."), 0); // show progress dialog in GUI
  while (file.good()) {
    pwalletMain->ShowProgress("",
      std::max(1, std::min(99,
        (int)(((double)file.tellg() / (double)nFilesize) * 100)))
    );
    std::string line;
    std::getline(file, line);

    if (line.empty() || line[0] == '#') {
      continue;
    }

    std::vector<std::string> vstr;
    boost::split(vstr, line, boost::is_any_of(" "));
    if (vstr.size() < 2) {
      continue;
    }
    CBitcoinSecret vchSecret;
    if (!vchSecret.SetString(vstr[0])) {
      continue;
    }
    CKey key = vchSecret.GetKey();
    CPubKey pubkey = key.GetPubKey();
    CKeyID keyid = pubkey.GetID();
    if (pwalletMain->HaveKey(keyid)) {
      // LogPrintf("Skipping import of %s (key already present)\n", CBitcoinAddress(keyid).ToString());
      continue;
    }
    int64_t nTime = DecodeDumpTime(vstr[1]);
    std::string strLabel;
    bool fLabel = true;
    for (unsigned int nStr = 2; nStr < vstr.size(); nStr++) {
      if (boost::algorithm::starts_with(vstr[nStr], "#")) {
        break;
      }
      if (vstr[nStr] == "change=1") {
        fLabel = false;
      }
      if (vstr[nStr] == "reserve=1") {
        fLabel = false;
      }
      if (boost::algorithm::starts_with(vstr[nStr], "label=")) {
        strLabel = DecodeDumpString(vstr[nStr].substr(6));
        fLabel = true;
      }
    }
    // LogPrintf("Importing %s...\n", CBitcoinAddress(keyid).ToString());
    if (!pwalletMain->AddKeyPubKey(key, pubkey)) {
      fGood = false;
      continue;
    }
    pwalletMain->mapKeyMetadata[keyid].nCreateTime = nTime;
    if (fLabel) {
      pwalletMain->SetAddressBook(keyid, strLabel, "receive");
    }
    nTimeBegin = std::min(nTimeBegin, nTime);
  }
  file.close();
  pwalletMain->ShowProgress("", 100); // hide progress dialog in GUI

  CBlockIndex *pindex = chainActive.Tip();
  while (pindex && pindex->pprev && pindex->GetBlockTime() > nTimeBegin - 7200) {
    pindex = pindex->pprev;
  }

  if (!pwalletMain->nTimeFirstKey || nTimeBegin < pwalletMain->nTimeFirstKey) {
    pwalletMain->nTimeFirstKey = nTimeBegin;
  }

  // LogPrintf("Rescanning last %i blocks\n", chainActive.Height() - pindex->nHeight + 1);
  pwalletMain->ScanForWalletTransactions(pindex);
  pwalletMain->MarkDirty();

  if (!fGood) {
    data->err_msg = std::string("Cannot open wallet dump file");
  }
}

static void
async_import_wallet_after(uv_work_t *req) {
  NanScope();
  async_import_wallet_data* data = static_cast<async_import_wallet_data*>(req->data);

  if (data->err_msg != "") {
    Local<Value> err = Exception::Error(NanNew<String>(data->err_msg));
    const unsigned argc = 1;
    Local<Value> argv[argc] = { err };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  } else {
    const unsigned argc = 2;
    Local<Value> argv[argc] = {
      Local<Value>::New(Null()),
      Local<Value>::New(NanNew<String>(data->path))
    };
    TryCatch try_catch;
    data->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
  }

  data->callback.Dispose();

  delete data;
  delete req;
}

/**
 * WalletChangeLabel()
 * bitcoindjs.walletChangeLabel(options)
 * Change account label
 */

NAN_METHOD(WalletChangeLabel) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletChangeLabel(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strAccount = std::string(EMPTY);

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  std::string addr = std::string("");

  if (options->Get(NanNew<String>("address"))->IsString()) {
    String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
    addr = std::string(*addr_);
  }

  if (strAccount == EMPTY && addr == "") {
    return NanThrowError("No address or account name entered.");
  }

  if (strAccount == EMPTY && addr != "") {
    BOOST_FOREACH(const PAIRTYPE(CBitcoinAddress, CAddressBookData)& item, pwalletMain->mapAddressBook) {
      const CBitcoinAddress& address = item.first;
      const string& strName = item.second.name;
      if (address.ToString() == addr) {
        strAccount = strName;
        break;
      }
    }
  }

  if (addr == "" && strAccount != EMPTY) {
    BOOST_FOREACH(const PAIRTYPE(CBitcoinAddress, CAddressBookData)& item, pwalletMain->mapAddressBook) {
      const CBitcoinAddress& address = item.first;
      const string& strName = item.second.name;
      if (strName == strAccount) {
        addr = address.ToString();
        break;
      }
    }
  }

  // If it isn't our address, create a recipient:
  CTxDestination dest = CBitcoinAddress(addr).Get();

  if (!IsMine(*pwalletMain, dest)) {
    pwalletMain->SetAddressBook(dest, strAccount, "send");
    pwalletMain->SetAddressBook(dest, strAccount, "send");
    NanReturnValue(True());
  }

  // Rename our address:
  pwalletMain->SetAddressBook(dest, strAccount, "receive");

  NanReturnValue(True());
}

/**
 * WalletDeleteAccount()
 * bitcoindjs.walletDeleteAccount(options)
 * Delete account and all associated addresses
 */

NAN_METHOD(WalletDeleteAccount) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletDeleteAccount(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string strAccount = std::string(EMPTY);

  if (options->Get(NanNew<String>("account"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("account"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("label"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("label"))->ToString());
    strAccount = std::string(*account_);
  }

  if (options->Get(NanNew<String>("name"))->IsString()) {
    String::Utf8Value account_(options->Get(NanNew<String>("name"))->ToString());
    strAccount = std::string(*account_);
  }

  std::string addr = std::string("");

  if (options->Get(NanNew<String>("address"))->IsString()) {
    String::Utf8Value addr_(options->Get(NanNew<String>("address"))->ToString());
    addr = std::string(*addr_);
  }

  // LOCK2(cs_main, pwalletMain->cs_wallet);

  CWalletDB walletdb(pwalletMain->strWalletFile);

  CAccount account;
  walletdb.ReadAccount(strAccount, account);

  if (strAccount == EMPTY) {
    BOOST_FOREACH(const PAIRTYPE(CBitcoinAddress, CAddressBookData)& item, pwalletMain->mapAddressBook) {
      const CBitcoinAddress& address = item.first;
      const string& strName = item.second.name;
      if (address.ToString() == addr) {
        strAccount = strName;
        break;
      }
    }
  }

  if (strAccount == EMPTY) {
    if (addr == "") {
      return NanThrowError("No account name specified.");
    } else {
      return NanThrowError("No account tied to specified address.");
    }
  }

  // Find all addresses that have the given account
  BOOST_FOREACH(const PAIRTYPE(CBitcoinAddress, CAddressBookData)& item, pwalletMain->mapAddressBook) {
    const CBitcoinAddress& address = item.first;
    const string& strName = item.second.name;
    if (strName == strAccount) {
      walletdb.EraseName(address.ToString());
      walletdb.ErasePurpose(address.ToString());
    }
  }

  NanReturnValue(True());
}

/**
 * WalletIsMine()
 * bitcoindjs.walletIsMine(options)
 * Check whether address or scriptPubKey is owned by wallet.
 */

NAN_METHOD(WalletIsMine) {
  NanScope();

  if (args.Length() < 1 || !args[0]->IsObject()) {
    return NanThrowError(
      "Usage: bitcoindjs.walletIsMine(options)");
  }

  Local<Object> options = Local<Object>::Cast(args[0]);

  std::string addr = std::string("");
  std::string spk = std::string("");

  if (options->Get(NanNew<String>("address"))->IsString()) {
    String::Utf8Value s_(options->Get(NanNew<String>("address"))->ToString());
    addr = std::string(*s_);
  }

  if (options->Get(NanNew<String>("scriptPubKey"))->IsString()) {
    String::Utf8Value s_(options->Get(NanNew<String>("scriptPubKey"))->ToString());
    spk = std::string(*s_);
  }

  // Bitcoin address
  CScript scriptPubKey;
  if (addr != "") {
    CBitcoinAddress address = CBitcoinAddress(addr);
    if (!address.IsValid()) {
      return NanThrowError("Invalid Bitcoin address");
    }
    scriptPubKey = GetScriptForDestination(address.Get());
  } else {
    scriptPubKey << ParseHex(spk);
  }

  bool is_mine = IsMine(*pwalletMain, scriptPubKey);

  NanReturnValue(NanNew<Boolean>(is_mine));
}

/**
 * Conversions
 *   cblock_to_jsblock(cblock, cblock_index, jsblock, is_new)
 *   ctx_to_jstx(ctx, block_hash, jstx)
 *   jsblock_to_cblock(jsblock, cblock)
 *   jstx_to_ctx(jstx, ctx)
 * These functions, only callable from C++, are used to convert javascript
 * blocks and tx objects to bitcoin block and tx objects (CBlocks and
 * CTransactions), and vice versa.
 */

// XXX Potentially add entire function's code. If there's a race
// condition, the duplicate check will handle it.
CBlockIndex *
find_new_block_index(uint256 hash, uint256 hashPrevBlock, bool *is_allocated) {
  // Check for duplicate
  BlockMap::iterator it = mapBlockIndex.find(hash);
  if (it != mapBlockIndex.end()) {
    return it->second;
  }

  // Construct new block index object
  CBlockIndex* pindexNew = new CBlockIndex();
  assert(pindexNew);
  BlockMap::iterator miPrev = mapBlockIndex.find(hashPrevBlock);
  if (miPrev != mapBlockIndex.end()) {
    pindexNew->pprev = (*miPrev).second;
    pindexNew->nHeight = pindexNew->pprev->nHeight + 1;
  }

  *is_allocated = true;

  return pindexNew;
}

static inline void
cblock_to_jsblock(const CBlock& cblock, CBlockIndex* cblock_index, Local<Object> jsblock, bool is_new) {
  bool is_allocated = false;

  if (!cblock_index && is_new) {
    cblock_index = find_new_block_index(cblock.GetHash(), cblock.hashPrevBlock, &is_allocated);
  }

  jsblock->Set(NanNew<String>("hash"), NanNew<String>(cblock.GetHash().GetHex()));
  CMerkleTx txGen(cblock.vtx[0]);
  txGen.SetMerkleBranch(cblock);
  jsblock->Set(NanNew<String>("confirmations"), NanNew<Number>((int)txGen.GetDepthInMainChain())->ToInt32());
  jsblock->Set(NanNew<String>("size"),
    NanNew<Number>((int)::GetSerializeSize(cblock, SER_NETWORK, PROTOCOL_VERSION))->ToInt32());

  if (cblock_index) {
    jsblock->Set(NanNew<String>("height"), NanNew<Number>(cblock_index->nHeight));
  }

  //
  // Headers
  //
  jsblock->Set(NanNew<String>("version"), NanNew<Number>((int32_t)cblock.nVersion));
  jsblock->Set(NanNew<String>("previousblockhash"), NanNew<String>((std::string)cblock.hashPrevBlock.ToString()));
  jsblock->Set(NanNew<String>("merkleroot"), NanNew<String>((std::string)cblock.hashMerkleRoot.GetHex()));
  jsblock->Set(NanNew<String>("time"), NanNew<Number>((uint32_t)cblock.GetBlockTime())->ToUint32());
  jsblock->Set(NanNew<String>("bits"), NanNew<Number>((uint32_t)cblock.nBits)->ToUint32());
  jsblock->Set(NanNew<String>("nonce"), NanNew<Number>((uint32_t)cblock.nNonce)->ToUint32());

  if (cblock_index) {
    jsblock->Set(NanNew<String>("difficulty"), NanNew<Number>(GetDifficulty(cblock_index)));
    jsblock->Set(NanNew<String>("chainwork"), NanNew<String>(cblock_index->nChainWork.GetHex()));
  }

  if (cblock_index) {
    CBlockIndex *pnext = chainActive.Next(cblock_index);
    if (pnext) {
      jsblock->Set(NanNew<String>("nextblockhash"), NanNew<String>(pnext->GetBlockHash().GetHex()));
    }
  }

  // Build merkle tree
  if (cblock.vMerkleTree.empty()) {
    cblock.BuildMerkleTree();
  }
  Local<Array> merkle = NanNew<Array>();
  int mi = 0;
  BOOST_FOREACH(uint256& hash, cblock.vMerkleTree) {
    merkle->Set(mi, NanNew<String>(hash.ToString()));
    mi++;
  }
  jsblock->Set(NanNew<String>("merkletree"), merkle);

  Local<Array> txs = NanNew<Array>();
  int ti = 0;
  BOOST_FOREACH(const CTransaction& ctx, cblock.vtx) {
    Local<Object> jstx = NanNew<Object>();
    const uint256 block_hash = cblock.GetHash();
    ctx_to_jstx(ctx, block_hash, jstx);
    txs->Set(ti, jstx);
    ti++;
  }
  jsblock->Set(NanNew<String>("tx"), txs);

  CDataStream ssBlock(SER_NETWORK, PROTOCOL_VERSION);
  ssBlock << cblock;
  std::string strHex = HexStr(ssBlock.begin(), ssBlock.end());
  jsblock->Set(NanNew<String>("hex"), NanNew<String>(strHex));

  // Was it allocated in find_new_block_index(), or did it already exist?
  // (race condition here)
  if (is_allocated) {
    delete cblock_index;
  }
}

static inline void
ctx_to_jstx(const CTransaction& ctx, uint256 block_hash, Local<Object> jstx) {
  // With v0.9.0
  // jstx->Set(NanNew<String>("mintxfee"), NanNew<Number>((int64_t)ctx.nMinTxFee)->ToInteger());
  // jstx->Set(NanNew<String>("minrelaytxfee"), NanNew<Number>((int64_t)ctx.nMinRelayTxFee)->ToInteger());
  jstx->Set(NanNew<String>("current_version"), NanNew<Number>((int)ctx.CURRENT_VERSION)->ToInt32());

  jstx->Set(NanNew<String>("txid"), NanNew<String>(ctx.GetHash().GetHex()));
  jstx->Set(NanNew<String>("version"), NanNew<Number>((int)ctx.nVersion)->ToInt32());
  jstx->Set(NanNew<String>("locktime"), NanNew<Number>((unsigned int)ctx.nLockTime)->ToUint32());

  Local<Array> vin = NanNew<Array>();
  int vi = 0;
  BOOST_FOREACH(const CTxIn& txin, ctx.vin) {
    Local<Object> in = NanNew<Object>();

    if (ctx.IsCoinBase()) {
      in->Set(NanNew<String>("coinbase"), NanNew<String>(HexStr(txin.scriptSig.begin(), txin.scriptSig.end())));
    }

    in->Set(NanNew<String>("txid"), NanNew<String>(txin.prevout.hash.GetHex()));
    in->Set(NanNew<String>("vout"), NanNew<Number>((unsigned int)txin.prevout.n)->ToUint32());

    Local<Object> o = NanNew<Object>();
    o->Set(NanNew<String>("asm"), NanNew<String>(txin.scriptSig.ToString()));
    o->Set(NanNew<String>("hex"), NanNew<String>(HexStr(txin.scriptSig.begin(), txin.scriptSig.end())));

    Local<Object> jsprev = NanNew<Object>();
    CTransaction prev_tx;
    if (GetTransaction(txin.prevout.hash, prev_tx, block_hash, true)) {
      CTxDestination from;
      CTxOut prev_out = prev_tx.vout[txin.prevout.n];
      ExtractDestination(prev_out.scriptPubKey, from);
      CBitcoinAddress addrFrom(from);
      jsprev->Set(NanNew<String>("address"), NanNew<String>(addrFrom.ToString()));
      jsprev->Set(NanNew<String>("value"), NanNew<Number>((int64_t)prev_out.nValue)->ToInteger());
    } else {
      jsprev->Set(NanNew<String>("address"), NanNew<String>(std::string("Unknown")));
      jsprev->Set(NanNew<String>("value"), NanNew<Number>(0));
    }
    in->Set(NanNew<String>("prev"), jsprev);

    in->Set(NanNew<String>("scriptSig"), o);

    in->Set(NanNew<String>("sequence"), NanNew<Number>((unsigned int)txin.nSequence)->ToUint32());

    vin->Set(vi, in);
    vi++;
  }
  jstx->Set(NanNew<String>("vin"), vin);

  Local<Array> vout = NanNew<Array>();
  for (unsigned int vo = 0; vo < ctx.vout.size(); vo++) {
    const CTxOut& txout = ctx.vout[vo];
    Local<Object> out = NanNew<Object>();

    out->Set(NanNew<String>("value"), NanNew<Number>((int64_t)txout.nValue)->ToInteger());
    out->Set(NanNew<String>("n"), NanNew<Number>((unsigned int)vo)->ToUint32());

    Local<Object> o = NanNew<Object>();
    {
      const CScript& scriptPubKey = txout.scriptPubKey;
      Local<Object> out = o;

      txnouttype type;
      vector<CTxDestination> addresses;
      int nRequired;
      out->Set(NanNew<String>("asm"), NanNew<String>(scriptPubKey.ToString()));
      out->Set(NanNew<String>("hex"), NanNew<String>(HexStr(scriptPubKey.begin(), scriptPubKey.end())));
      if (!ExtractDestinations(scriptPubKey, type, addresses, nRequired)) {
        out->Set(NanNew<String>("type"), NanNew<String>(GetTxnOutputType(type)));
      } else {
        out->Set(NanNew<String>("reqSigs"), NanNew<Number>((int)nRequired)->ToInt32());
        out->Set(NanNew<String>("type"), NanNew<String>(GetTxnOutputType(type)));
        Local<Array> a = NanNew<Array>();
        int ai = 0;
        BOOST_FOREACH(const CTxDestination& addr, addresses) {
          a->Set(ai, NanNew<String>(CBitcoinAddress(addr).ToString()));
          ai++;
        }
        out->Set(NanNew<String>("addresses"), a);
      }
    }
    out->Set(NanNew<String>("scriptPubKey"), o);

    vout->Set(vo, out);
  }
  jstx->Set(NanNew<String>("vout"), vout);

  if (block_hash != 0) {
    jstx->Set(NanNew<String>("blockhash"), NanNew<String>(block_hash.GetHex()));
    CWalletTx cwtx(pwalletMain, ctx);
    int confirms = cwtx.GetDepthInMainChain();
    jstx->Set(NanNew<String>("confirmations"), NanNew<Number>(confirms));
    if (ctx.IsCoinBase()) {
      jstx->Set(NanNew<String>("generated"), NanNew<Boolean>(true));
    }
    if (confirms > 0) {
      jstx->Set(NanNew<String>("blockhash"), NanNew<String>(cwtx.hashBlock.GetHex()));
      jstx->Set(NanNew<String>("blockindex"), NanNew<Number>(cwtx.nIndex));
      jstx->Set(NanNew<String>("blocktime"), NanNew<Number>(mapBlockIndex[cwtx.hashBlock]->GetBlockTime()));
    } else {
      jstx->Set(NanNew<String>("blockhash"), NanNew<String>(uint256(0).GetHex()));
      jstx->Set(NanNew<String>("blockindex"), NanNew<Number>(-1));
      jstx->Set(NanNew<String>("blocktime"), NanNew<Number>(0));
    }
    Local<Array> conflicts = NanNew<Array>();
    int co = 0;
    BOOST_FOREACH(const uint256& conflict, cwtx.GetConflicts()) {
      conflicts->Set(co++, NanNew<String>(conflict.GetHex()));
    }
    jstx->Set(NanNew<String>("walletconflicts"), conflicts);
    jstx->Set(NanNew<String>("time"), NanNew<Number>(cwtx.GetTxTime()));
    jstx->Set(NanNew<String>("timereceived"), NanNew<Number>((int64_t)cwtx.nTimeReceived));
  } else {
    jstx->Set(NanNew<String>("blockhash"), NanNew<String>(uint256(0).GetHex()));
    jstx->Set(NanNew<String>("confirmations"), NanNew<Number>(-1));
    jstx->Set(NanNew<String>("generated"), NanNew<Boolean>(false));
    jstx->Set(NanNew<String>("blockhash"), NanNew<String>(uint256(0).GetHex()));
    jstx->Set(NanNew<String>("blockindex"), NanNew<Number>(-1));
    jstx->Set(NanNew<String>("blocktime"), NanNew<Number>(0));
    jstx->Set(NanNew<String>("walletconflicts"), NanNew<Array>());
    jstx->Set(NanNew<String>("time"), NanNew<Number>(0));
    jstx->Set(NanNew<String>("timereceived"), NanNew<Number>(0));
  }

  CDataStream ssTx(SER_NETWORK, PROTOCOL_VERSION);
  ssTx << ctx;
  std::string strHex = HexStr(ssTx.begin(), ssTx.end());
  jstx->Set(NanNew<String>("hex"), NanNew<String>(strHex));
}

static inline void
jsblock_to_cblock(const Local<Object> jsblock, CBlock& cblock) {
  cblock.nVersion = (int32_t)jsblock->Get(NanNew<String>("version"))->Int32Value();

  if (jsblock->Get(NanNew<String>("previousblockhash"))->IsString()) {
    String::AsciiValue hash__(jsblock->Get(NanNew<String>("previousblockhash"))->ToString());
    std::string hash_ = *hash__;
    uint256 hash(hash_);
    cblock.hashPrevBlock = (uint256)hash;
  } else {
    // genesis block
    cblock.hashPrevBlock = (uint256)uint256(0);
  }

  String::AsciiValue mhash__(jsblock->Get(NanNew<String>("merkleroot"))->ToString());
  std::string mhash_ = *mhash__;
  uint256 mhash(mhash_);
  cblock.hashMerkleRoot = (uint256)mhash;

  cblock.nTime = (uint32_t)jsblock->Get(NanNew<String>("time"))->Uint32Value();
  cblock.nBits = (uint32_t)jsblock->Get(NanNew<String>("bits"))->Uint32Value();
  cblock.nNonce = (uint32_t)jsblock->Get(NanNew<String>("nonce"))->Uint32Value();

  Local<Array> txs = Local<Array>::Cast(jsblock->Get(NanNew<String>("tx")));
  for (unsigned int ti = 0; ti < txs->Length(); ti++) {
    Local<Object> jstx = Local<Object>::Cast(txs->Get(ti));
    CTransaction ctx;
    jstx_to_ctx(jstx, ctx);
    cblock.vtx.push_back(ctx);
  }

  if (cblock.vMerkleTree.empty()) {
    cblock.BuildMerkleTree();
  }
}

// NOTE: For whatever reason when converting a jstx to a CTransaction via
// setting CTransaction properties, the binary output of a jstx is not the same
// as what went in. It is unknow why this occurs. For now we are are using a
// workaround by carrying the original hex value on the object which is changed
// when the tx is changed.
static inline void
jstx_to_ctx(const Local<Object> jstx, CTransaction& ctx_) {
  String::AsciiValue hex_string_(jstx->Get(NanNew<String>("hex"))->ToString());
  std::string hex_string = *hex_string_;

  CDataStream ssData(ParseHex(hex_string), SER_NETWORK, PROTOCOL_VERSION);
  try {
    ssData >> ctx_;
  } catch (std::exception &e) {
    NanThrowError("Bad TX decode");
  }

  return;

  CMutableTransaction& ctx = (CMutableTransaction&)ctx_;

  // With v0.9.0
  // ctx.nMinTxFee = (int64_t)jstx->Get(NanNew<String>("mintxfee"))->IntegerValue();
  // ctx.nMinRelayTxFee = (int64_t)jstx->Get(NanNew<String>("minrelaytxfee"))->IntegerValue();

  // ctx.CURRENT_VERSION = (unsigned int)jstx->Get(NanNew<String>("current_version"))->Int32Value();

  ctx.nVersion = (int)jstx->Get(NanNew<String>("version"))->Int32Value();

  Local<Array> vin = Local<Array>::Cast(jstx->Get(NanNew<String>("vin")));
  for (unsigned int vi = 0; vi < vin->Length(); vi++) {
    CTxIn txin;

    Local<Object> in = Local<Object>::Cast(vin->Get(vi));

    //if (ctx.IsCoinBase()) {
    //  txin.prevout.hash = uint256(0);
    //  txin.prevout.n = (unsigned int)0;
    //} else {
      String::AsciiValue phash__(in->Get(NanNew<String>("txid"))->ToString());
      std::string phash_ = *phash__;
      uint256 phash(phash_);

      txin.prevout.hash = phash;
      txin.prevout.n = (unsigned int)in->Get(NanNew<String>("vout"))->Uint32Value();
    //}

    std::string shash_;
    Local<Object> script_obj = Local<Object>::Cast(in->Get(NanNew<String>("scriptSig")));
    String::AsciiValue shash__(script_obj->Get(NanNew<String>("hex"))->ToString());
    shash_ = *shash__;
    uint256 shash(shash_);
    CScript scriptSig(shash);

    txin.scriptSig = scriptSig;
    txin.nSequence = (unsigned int)in->Get(NanNew<String>("sequence"))->Uint32Value();

    ctx.vin.push_back(txin);
  }

  Local<Array> vout = Local<Array>::Cast(jstx->Get(NanNew<String>("vout")));
  for (unsigned int vo = 0; vo < vout->Length(); vo++) {
    CTxOut txout;

    Local<Object> out = Local<Object>::Cast(vout->Get(vo));

    int64_t nValue = (int64_t)out->Get(NanNew<String>("value"))->IntegerValue();
    txout.nValue = nValue;

    Local<Object> script_obj = Local<Object>::Cast(out->Get(NanNew<String>("scriptPubKey")));
    String::AsciiValue phash__(script_obj->Get(NanNew<String>("hex")));
    std::string phash_ = *phash__;
    uint256 phash(phash_);
    CScript scriptPubKey(phash);

    txout.scriptPubKey = scriptPubKey;

    ctx.vout.push_back(txout);
  }

  ctx.nLockTime = (unsigned int)jstx->Get(NanNew<String>("locktime"))->Uint32Value();
}

static leveldb::Options
GetOptions(size_t nCacheSize) {
  leveldb::Options options;
  options.block_cache = leveldb::NewLRUCache(nCacheSize / 2);
  options.write_buffer_size = nCacheSize / 4; // up to two write buffers may be held in memory simultaneously
  options.filter_policy = leveldb::NewBloomFilterPolicy(10);
  options.compression = leveldb::kNoCompression;
  options.max_open_files = 64;
  if (leveldb::kMajorVersion > 1 || (leveldb::kMajorVersion == 1 && leveldb::kMinorVersion >= 16)) {
    // LevelDB versions before 1.16 consider short writes to be corruption. Only trigger error
    // on corruption in later versions.
    options.paranoid_checks = true;
  }
  return options;
}

// http://leveldb.googlecode.com/svn/tags/1.17/doc/index.html

class TwoPartComparator : public leveldb::Comparator {
  public:
    // Three-way comparison function:
    //   if a < end: negative result
    //   if a > end: positive result
    //   else: zero result
    int Compare(const leveldb::Slice& key, const leveldb::Slice& end) const {
      std::string key_ = key.ToString();
      std::string end_ = end.ToString();

      const char *k = key_.c_str();
      const char *e = end_.c_str();

      if (k[0] == 't') {
        unsigned int el = strlen(e);
        if (k[el - 1] == '\0' || k[el - 1] == e[el - 1]) {
          return 1;
        }
        return -1;
      }
      return 1;
    }

    // Ignore the following methods for now:
    const char* Name() const { return "TwoPartComparator"; }
    void FindShortestSeparator(std::string*, const leveldb::Slice&) const { }
    void FindShortSuccessor(std::string*) const { }
};

static ctx_list *
read_addr(const std::string addr) {
  ctx_list *head = new ctx_list();
  ctx_list *cur = NULL;

  // custom environment this database is using (may be NULL in case of default environment)
  leveldb::Env* penv;

  // database options used
  leveldb::Options options;

  // options used when reading from the database
  leveldb::ReadOptions readoptions;

  // options used when iterating over values of the database
  leveldb::ReadOptions iteroptions;

  // options used when writing to the database
  leveldb::WriteOptions writeoptions;

  // options used when sync writing to the database
  leveldb::WriteOptions syncoptions;

  // the database itself
  leveldb::DB* pdb;

  size_t nCacheSize = 0x100000;
  bool fMemory = false;

  penv = NULL;
  readoptions.verify_checksums = true;
  iteroptions.verify_checksums = true;
  iteroptions.fill_cache = false;
  syncoptions.sync = true;
  options = GetOptions(nCacheSize);
  options.create_if_missing = true;

  TwoPartComparator cmp;
  options.comparator = &cmp;

#ifdef USE_LDB_FILES
  unsigned int nFile = 0;
  unsigned int tryFiles = 0xffffffff;
  for (; nFile < tryFiles; nFile++) {
    const boost::filesystem::path path = GetDataDir() / "blocks" / strprintf("%s%05u.dat", "blk", nFile);
#else
  {
    const boost::filesystem::path path = GetDataDir() / "blocks" / "index";
#endif
    if (fMemory) {
      penv = leveldb::NewMemEnv(leveldb::Env::Default());
      options.env = penv;
    }

    leveldb::Status status = leveldb::DB::Open(options, path.string(), &pdb);

    if (!status.ok()) {
      return head;
    }

    leveldb::Slice start = "t";
    leveldb::Slice end = "t\xFF";
    //leveldb::Options options;

    leveldb::Iterator* it = pdb->NewIterator(leveldb::ReadOptions());

    for (it->Seek(start); it->Valid(); it->Next()) {
      leveldb::Slice key = it->key();
      leveldb::Slice value = it->value();

      if (options.comparator->Compare(key, end) > 0) {
        break;
      } else {
        std::string strValue = value.ToString();
        CTransaction ctx;

        // CDataStream ssKey(SER_DISK, CLIENT_VERSION);
        // ssKey.reserve(ssKey.GetSerializeSize(key.ToString()));
        // ssKey << key.ToString();
        // leveldb::Slice slKey(&ssKey[0], ssKey.size());
        // leveldb::Status status = pdb->Get(readoptions, slKey, &strValue);
        // // leveldb::Status status = pdb->Get(readoptions, key, &strValue);
        // if (!status.ok()) {
        //   if (status.IsNotFound()) continue;
        // }

        try {
          CDataStream ssValue(strValue.data(), strValue.data() + strValue.size(), SER_DISK, CLIENT_VERSION);
          ssValue >> ctx;
        } catch (const std::exception&) {
          // return NULL;
          continue;
        }

        for (unsigned int vo = 0; vo < ctx.vout.size(); vo++) {
          const CTxOut& txout = ctx.vout[vo];
          const CScript& scriptPubKey = txout.scriptPubKey;
          int nRequired;
          txnouttype type;
          vector<CTxDestination> addresses;
          if (!ExtractDestinations(scriptPubKey, type, addresses, nRequired)) {
            continue;
          }
          BOOST_FOREACH(const CTxDestination& address, addresses) {
            if (CBitcoinAddress(address).ToString() != addr) {
              continue;
            }
            if (cur == NULL) {
              head->ctx = ctx;
              uint256 hash(((CMerkleTx)ctx).hashBlock.GetHex());
              head->blockhash = hash;
              head->next = NULL;
              cur = head;
            } else {
              ctx_list *item = new ctx_list();
              item->ctx = ctx;
              uint256 hash(((CMerkleTx)ctx).hashBlock.GetHex());
              item->blockhash = hash;
              item->next = NULL;
              cur->next = item;
              cur = item;
            }
            goto found;
          }
        }

found:
        continue;
      }
    }

    delete it;
#ifdef USE_LDB_FILES
  }
#else
  }
#endif

  return head;
}

// Luckily, we never have to change this.
static void
get_genesis_block(CBlock *genesis) {
  // Satoshi's first coinbase:
  const char* pszTimestamp =
    "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";
  CMutableTransaction txNew;
  txNew.vin.resize(1);
  txNew.vout.resize(1);
  txNew.vin[0].scriptSig = CScript()
    << 486604799
    << CScriptNum(4)
    << vector<unsigned char>((const unsigned char*)pszTimestamp,
        (const unsigned char*)pszTimestamp + strlen(pszTimestamp));
  txNew.vout[0].nValue = 50 * COIN;
  txNew.vout[0].scriptPubKey = CScript() << ParseHex(
    "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6"
    "bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f"
  ) << OP_CHECKSIG;
  genesis->vtx.push_back(txNew);
  genesis->hashPrevBlock = 0;
  genesis->hashMerkleRoot = genesis->BuildMerkleTree();
  genesis->nVersion = 1;
  genesis->nTime = 1231006505;
  genesis->nBits = 0x1d00ffff;
  genesis->nNonce = 2083236893;
  const uint256 hashGenesisBlock = genesis->GetHash();
  assert(hashGenesisBlock == uint256(
    "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"));
  assert(genesis->hashMerkleRoot == uint256(
    "0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"));
}

/**
 * Init()
 * Initialize the singleton object known as bitcoindjs.
 */

extern "C" void
init(Handle<Object> target) {
  NanScope();

  NODE_SET_METHOD(target, "start", StartBitcoind);
  NODE_SET_METHOD(target, "stop", StopBitcoind);
  NODE_SET_METHOD(target, "stopping", IsStopping);
  NODE_SET_METHOD(target, "stopped", IsStopped);
  NODE_SET_METHOD(target, "getBlock", GetBlock);
  NODE_SET_METHOD(target, "getTx", GetTx);
  NODE_SET_METHOD(target, "broadcastTx", BroadcastTx);
  NODE_SET_METHOD(target, "verifyBlock", VerifyBlock);
  NODE_SET_METHOD(target, "verifyTransaction", VerifyTransaction);
  NODE_SET_METHOD(target, "fillTransaction", FillTransaction);
  NODE_SET_METHOD(target, "getInfo", GetInfo);
  NODE_SET_METHOD(target, "getPeerInfo", GetPeerInfo);
  NODE_SET_METHOD(target, "getAddresses", GetAddresses);
  NODE_SET_METHOD(target, "walletGetRecipients", WalletGetRecipients);
  NODE_SET_METHOD(target, "walletSetRecipient", WalletSetRecipient);
  NODE_SET_METHOD(target, "walletRemoveRecipient", WalletRemoveRecipient);
  NODE_SET_METHOD(target, "getProgress", GetProgress);
  NODE_SET_METHOD(target, "setGenerate", SetGenerate);
  NODE_SET_METHOD(target, "getGenerate", GetGenerate);
  NODE_SET_METHOD(target, "getMiningInfo", GetMiningInfo);
  NODE_SET_METHOD(target, "getAddrTransactions", GetAddrTransactions);
  NODE_SET_METHOD(target, "getBestBlock", GetBestBlock);
  NODE_SET_METHOD(target, "getBlockHex", GetBlockHex);
  NODE_SET_METHOD(target, "getTxHex", GetTxHex);
  NODE_SET_METHOD(target, "blockFromHex", BlockFromHex);
  NODE_SET_METHOD(target, "txFromHex", TxFromHex);
  NODE_SET_METHOD(target, "hookPackets", HookPackets);

  NODE_SET_METHOD(target, "walletNewAddress", WalletNewAddress);
  NODE_SET_METHOD(target, "walletGetAccountAddress", WalletGetAccountAddress);
  NODE_SET_METHOD(target, "walletSetAccount", WalletSetAccount);
  NODE_SET_METHOD(target, "walletGetAccount", WalletGetAccount);
  NODE_SET_METHOD(target, "walletSendTo", WalletSendTo);
  NODE_SET_METHOD(target, "walletSignMessage", WalletSignMessage);
  NODE_SET_METHOD(target, "walletVerifyMessage", WalletVerifyMessage);
  NODE_SET_METHOD(target, "walletGetBalance", WalletGetBalance);
  NODE_SET_METHOD(target, "walletCreateMultiSigAddress", WalletCreateMultiSigAddress);
  NODE_SET_METHOD(target, "walletGetUnconfirmedBalance", WalletGetUnconfirmedBalance);
  NODE_SET_METHOD(target, "walletSendFrom", WalletSendFrom);
  NODE_SET_METHOD(target, "walletMove", WalletMove);
  NODE_SET_METHOD(target, "walletListTransactions", WalletListTransactions);
  NODE_SET_METHOD(target, "walletReceivedByAddress", WalletReceivedByAddress);
  NODE_SET_METHOD(target, "walletListAccounts", WalletListAccounts);
  NODE_SET_METHOD(target, "walletGetTransaction", WalletGetTransaction);
  NODE_SET_METHOD(target, "walletBackup", WalletBackup);
  NODE_SET_METHOD(target, "walletPassphrase", WalletPassphrase);
  NODE_SET_METHOD(target, "walletPassphraseChange", WalletPassphraseChange);
  NODE_SET_METHOD(target, "walletLock", WalletLock);
  NODE_SET_METHOD(target, "walletEncrypt", WalletEncrypt);
  NODE_SET_METHOD(target, "walletEncrypted", WalletEncrypted);
  NODE_SET_METHOD(target, "walletDumpKey", WalletDumpKey);
  NODE_SET_METHOD(target, "walletKeyPoolRefill", WalletKeyPoolRefill);
  NODE_SET_METHOD(target, "walletSetTxFee", WalletSetTxFee);
  NODE_SET_METHOD(target, "walletImportKey", WalletImportKey);
  NODE_SET_METHOD(target, "walletDumpWallet", WalletDumpWallet);
  NODE_SET_METHOD(target, "walletImportWallet", WalletImportWallet);
  NODE_SET_METHOD(target, "walletChangeLabel", WalletChangeLabel);
  NODE_SET_METHOD(target, "walletDeleteAccount", WalletDeleteAccount);
  NODE_SET_METHOD(target, "walletIsMine", WalletIsMine);
}

NODE_MODULE(bitcoindjs, init)
