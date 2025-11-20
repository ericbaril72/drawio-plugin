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

## sample.drawio 
Here a simple example showing the temperature of 7x thermometers, T1 to T7
<img width="652" height="340" alt="image" src="https://github.com/user-attachments/assets/c2ff7f8b-2a62-47e5-a8ef-6d81a8069c37" />

Each "drawio box" has 2 custom properties : entity_id & entity_state
<img width="745" height="285" alt="image" src="https://github.com/user-attachments/assets/f8ee1e69-a093-4b65-a0d6-62cd2bc8fe8b" />

<img width="615" height="284" alt="image" src="https://github.com/user-attachments/assets/c26eafd3-6e14-4739-bfa4-63351ef6c501" />
- the value for "identity_id" needs to match the identity_id found in HomeAssistant
- the value for "entity_state" will be displayed until replaced by the fetched-data


### Label format:
to display the "entity_state", each of the 'Labels" includes a placeholder :     %entity_state%
<img width="363" height="187" alt="image" src="https://github.com/user-attachments/assets/a3822a80-8043-47d8-aa25-a6ae099bdf98" />
