#!/bin/bash

# Inspired by: https://gist.github.com/joshisa/297b0bc1ec0dcdda0d1625029711fa24
# Referenced and tweaked from http://stackoverflow.com/questions/6174220/parse-url-in-shell-script#6174447
url="$1"
protocol=$(echo "$1" | grep "://" | sed -e's,^\(.*://\).*,\1,g')
url_no_protocol=$(echo "${1/$protocol/}")
protocol=$(echo "$protocol" | tr '[:upper:]' '[:lower:]')
userpass=$(echo "$url_no_protocol" | grep "@" | cut -d"/" -f1 | rev | cut -d"@" -f2- | rev)
pass=$(echo "$userpass" | grep ":" | cut -d":" -f2)
if [ -n "$pass" ]; then
  user=$(echo "$userpass" | grep ":" | cut -d":" -f1)
else
  user="$userpass"
fi
hostport=$(echo "${url_no_protocol/$userpass@/}" | cut -d"/" -f1)
host=$(echo "$hostport" | cut -d":" -f1)
port=$(echo "$hostport" | grep ":" | cut -d":" -f2)
path=$(echo "$url_no_protocol" | grep "/" | cut -d"/" -f2- | cut -d"?" -f1)

echo -n '{
    "Servers": {
        "1": {
            "Name": "Displaycontroller",
            "Group": "Servers",
            "Host": "'$host'",
            "Port": '$port',
            "Shared": true,
            "Username": "'$user'",
            "MaintenanceDB": "'$path'",
            "PassFile": "/pgPass"
        }
    }
}' > ./servers.json

echo "$host:$port:$path:$user:$pass" > ./pgPass
echo "$host:$port:postgres:$user:$pass" >> ./pgPass