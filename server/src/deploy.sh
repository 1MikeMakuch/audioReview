
set -x

nvm use 14

cd /home/mkm/virtuals/vicstapes/nodeapp

git checkout .
git pull 
pm2 restart node-vt 
cd /home/mkm/virtuals/vicstapes/nodeapp/ui
npm run build

