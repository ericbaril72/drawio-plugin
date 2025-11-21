//http://10.0.0.143:8080/?lightbox=0&#LHomeAssistant.drawio#%7B%22pageId%22%3A%22macWGlGEMl3p2b7gNTdF%22%7D

Draw.loadPlugin(function(ui) {
    var graph = ui.editor.graph;
    var model = graph.getModel();
	var updateInterval = parseInt(urlParams['update-interval'] || 60000);
	var updateUrlParam = urlParams['update-url'];
	var updateUrl = null;
    if (ui.editor.isChromelessView()) {
        //return;
    }

	const fetchData = async () => {
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWQxM2Y2ODg2MmI0ZWZmODdkYjllOGJmN2QwY2QzNSIsImlhdCI6MTc2MzU2MTY2OSwiZXhwIjoyMDc4OTIxNjY5fQ.D83V5a8SBfQ_2QSq61rUbN74gJQVNww4PUr5Km8IKyQ'; // Replace with your actual token
		const url = 'http://10.0.0.143:8123/api/states'; // Replace with your target URL http://10.0.0.143
	
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
        if (true || graph.isEnabled() ) {
			console.log("graph is enabled")
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
	var currentThread = null;
	function scheduleUpdates()
		{
			var page = ui.currentPage;
			var root = ui.editor.graph.getModel().getRoot();
			var result = false;
			
			if (urlParams['update-url'] || (root.value != null && typeof(root.value) == 'object'))
			{
				console.log("goes into...");
				if (root.value != null && typeof(root.value) == 'object')
				{
					updateInterval = parseInt(root.value.getAttribute('updateInterval') || updateInterval);
					updateUrl = root.value.getAttribute('updateUrl') || updateUrl;
				}
				console.log("updateUrl:",updateUrl);
				if (updateUrl != null)
				{
					var currentXml = mxUtils.getXml(ui.editor.getGraphXml());
					
					function doUpdate()
					{
						if (updateUrl === 'demo')
						{
							parseResponse(mxUtils.getXml(createDemoResponse().documentElement));	
							schedule();
						}
						else
						{
							mxUtils.post(updateUrl, 'xml=' + encodeURIComponent(currentXml), function(req)
							{
								if (page === editorUi.currentPage)
								{
									if (req.getStatus() >= 200 && req.getStatus() <= 300)
									{
										parseResponse(mxUtils.getXml(req.getDocumentElement()));
										schedule();
									}
									else
									{
										ui.handleError({message: mxResources.get('error') + ' ' +
											req.getStatus()});
									}
								}
							}, function(err)
							{
								ui.handleError(err);
							});
						}
					};
					
					function schedule()
					{
						currentThread = window.setTimeout(doUpdate, updateInterval);
					};
					
					doUpdate();
					result = true;
				}
				else {
					console.log("updateUrl is null");
					fetchData();
				}
			}
			console.log("urlParams['update-url']:",urlParams['update-url']);
			console.log("root.value:",root.value);
			console.log("typeof(root.value):",typeof(root.value));
			
			return result;
		};
		
		function startUpdates()
		{
			console.log("start updates")
			var result = scheduleUpdates();
			
			if (result)
			{
				editorUi.editor.addListener('pageSelected', function()
				{
					window.clearTimeout(currentThread);
					scheduleUpdates();
				});
			}
			
			return result;
		};
		if (!startUpdates())
		{
			console.log("!start updates")
			ui.editor.addListener('fileLoaded', startUpdates);
		}
}); // end of loadplugin
