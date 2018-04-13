echo "Beginning mobile lightwallet deploy .. \n"
cd packages/lightwallet

echo "npm run build -- --prod \n"
npm run build -- --prod 

echo "firebase deploy \n"
cd mobile 
firebase deploy