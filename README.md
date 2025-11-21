# herbangin-application
Herbangin application
Run on node v18

## Installation
1. Install [pgadmin4](https://www.pgadmin.org/download/pgadmin-4-windows/)
2. Open `pgadmin4`
3. Create user `herbangin`
4. Create DB `herbangin_supply` for user `herbangin`
5. Run `npm run migrate`
6. Run `npm run seed`

## Preparation
1. Copy Folders
2. Run `npm install` on client and server

## Run
1. Run `npm install -g pm2`
2. Open `taskschd.msc`
3. Create basic task scheduler at logon to run `start.bat`
4. Edit `start.bat` to cwd
5. Run the task scheduler
6. Create a shortcut of `restart.bat` and set run as administrator

test1
test2
