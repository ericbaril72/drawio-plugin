Draw.loadPlugin(function(ui) {
    var graph = ui.editor.graph;
    var model = graph.getModel();

    if (ui.editor.isChromelessView()) {
        return;
    }

	const fetchData = async () => {
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWQxM2Y2ODg2MmI0ZWZmODdkYjllOGJmN2QwY2QzNSIsImlhdCI6MTc2MzU2MTY2OSwiZXhwIjoyMDc4OTIxNjY5fQ.D83V5a8SBfQ_2QSq61rUbN74gJQVNww4PUr5Km8IKyQ'; // Replace with your actual token
		const url = 'http://192.168.3.161:8123/api/states'; // Replace with your target URL http://10.0.0.143
	
		try {
		    const response = await fetch(url, {
			    method: 'GET',
				headers: {
			        'Authorization': `Bearer ${token}`,
			        'Content-Type': 'application/json', // Example header, adjust as needed
			        'Connection': 'keep-alive' // Example header, often handled by browser/runtime
				}
		    });
	
		    if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
		    }
	
		    const data = await response.json();
		    console.log('Data received:', data);
			update_cells(data);
			
		} catch (error) {
		    console.error('Error fetching data:', error);
		}
	};
	
    mxResources.parse('fetchdata=HomeAssistant Fetch');

    // Adds menu
    var menu = ui.menus.get('extras');
    var oldFunct = menu.funct;
    menu.funct = function(menuvar, parent)
	{
		oldFunct.apply(this, arguments);
        ui.menus.addMenuItems(menuvar, ['-', 'fetchdata']);
	};
    // Adds actions
    ui.actions.addAction('fetchdata', function() {
		fetchData();
	}, null, null, 'v1.0');	

	
	function update_cells(data){
		console.log("applying to cells")
        if (graph.isEnabled() ) {
            var cells = graph.getModel().cells;
			
			Object.keys(cells).forEach(function(key) {
				if (cells[key].value instanceof Object){
					//console.log("cell:",cells[key].value)
					if (cells[key].hasAttribute("entity_id")) {
						var entity_id=cells[key].getAttribute("entity_id");
						console.log("entity_id:",entity_id)
						for (let i = 0; i < data.length; i++) {
							if (data[i].entity_id==entity_id){
								console.log("i:",i,data[i].entity_id,data[i].state)

								var cell = model.cells[key];
								var state = graph.view.getState(cell);
								var newcell = state.cell;
								newcell.setAttribute("entity_state",data[i].state)
						  }
						}
						
					}
				}
            });
			graph.refresh();
	    }
	}
}); // end of loadplugin
