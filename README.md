Still needs to be pampered but ..

#Todo TOKEN_ID to move in the .drawio file
#Todo URL to move in the .drawio file
#Todo Docker-compose.sh example
#Todo PreConfig.js file settings required
#Todo How to apply the plugin
#Requirements for the Drawio Cell

# Matching a cell Label with HomeAssistant data

## Running a local DrawIO server
On your Docker based Home Assistant server
docker run -it --rm --name="draw" -p 8080:8080 -p 8443:8443 jgraph/drawio &

## HomeAssistant
in configuration.yaml ... add the the same ip:port as the drawio server is running
http:
  cors_allowed_origins:
    - "http://localhost:8080"
