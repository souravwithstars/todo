mkdir -p src/database; echo '[]' > src/database/userDetails.json
mkdir -p test/database; echo '[]' > test/database/userDetails.json

read -p "Enter first key [ default : dummy1 ] : "  key1

if [[ -z $key1 ]]
then
  key1=dummy1
fi

read -p "Enter second key [ default : dummy2 ] : " key2

if [[ -z $key2 ]]
then
  key2=dummy2
fi

echo "[\"$key1\", \"$key2\"]" > src/secretKeys.json

echo -e "\nInstalling Modules"

npm install

echo -e "\nDone\n\nStart using npm start"
