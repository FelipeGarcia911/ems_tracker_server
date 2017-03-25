cd /home/felipe/NodeJS/ems_track_server

echo " ------------- GIT Operations------------- "
git add .
git commit - m "Cambios ejecutados desde Script"
git push origin master

echo " ------------- Heroku Operations------------- "
git push heroku master
heroku ps:scale web=0
heroku ps:scale web=1
