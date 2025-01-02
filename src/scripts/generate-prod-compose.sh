
cd "$(dirname "$0")/.."

APP_TAG=$1
PROD_PATH=$2

config=$(docker compose config)

# Remove all build-related configuration
config=$(echo "$config" | yq 'del(.services[].build)' -y )

# Add tag to all images on ghcr.io
config=$(echo "$config" | yq --arg APP_TAG "$APP_TAG" '(.services[].image | select(test("^ghcr"))) |= . + ":" + $APP_TAG' -y)

# Replace all occurrences of cwd with $PROD_PATH
config=$(echo "$config" | yq --arg PROD_PATH "$PROD_PATH/volumes" --arg CWD "$(pwd)" '.services |= map_values(.volumes[]?.source |= gsub("^" + $CWD; $PROD_PATH))' -y)

cd - > /dev/null

echo "$config" > docker-compose.prod.yml