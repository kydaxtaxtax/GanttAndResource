

	//gantt.init("gantt_here");

	var fileDnD = fileDragAndDrop();
	fileDnD.init(gantt.$container);

	function sendFile(file) {
		fileDnD.showUpload();
		upload(file, function () {
			fileDnD.hideOverlay();
		})
	}

	function upload(file, callback) {
		gantt.importFromMSProject({
			data: file,
			callback: function (project) {
				if (project) {
					gantt.clearAll();

					if (project.config.duration_unit) {
						gantt.config.duration_unit = project.config.duration_unit;
					}

					for (key of project.data.data)
					{

						key.planned_start = zeroTime(key.start_date);
						key.planned_end = endDays(key.start_date, Number.parseInt(key.duration));
						key.sd = zeroTime(key.start_date);
						key.start_date = key.planned_start;
						key.end_date = key.planned_start;
						key.duration = 0;
						key.responsible = "";

												var o = false;
												for (j of project.data.data)
												{
													if(key.id == j.parent)
													{
														key.type = "project";
														o = true;
														break;
													}
												}

												if(o == false)
												{
													key.type = "task";
													key.render = "split";
													key.open = "0";
												}
					}


					project.data.links = [];

					gantt.parse(project.data);

				}
/*
				var obj = JSON.stringify(project.data);
				var object = obj;//этой переменной приравнивай свой объект, который получился
				var form_data = new FormData(); //создание формы для загрузки на сервер
				form_data.append('object', object);
				$.ajax({
		  	url: 'index.php', // ссылка куда отправлять объект, кирилл скажет
		  	dataType: 'text', // тип данных
		  	cache: false, // сохранение кеша
		  	contentType: false, //создание типа (по стандарту false)
		  	processData: false, //установка определенного типа (по стандарту false)
		  	data: form_data, // сами данные для отправки
		  	type: 'post', // тип передачи данных на сервер
		  	success: function(response)
				{ // после отправки данных, сервер отслыает обратно информацию либо необходимые параметры
		    //обработка полученных данных,
				console.log(response);
		  }
		});
*/
				if (callback)
					callback(project);
			}
		});
	}

	fileDnD.onDrop(sendFile);
	var form = document.getElementById("mspImport");
	form.onsubmit = function (event) {
		event.preventDefault();
		var fileInput = document.getElementById("mspFile");
		if (fileInput.files[0])
			sendFile(fileInput.files[0]);
	};







	/*

		//gantt.init("gantt_here");

		var fileDnD = fileDragAndDrop();
		fileDnD.init(gantt.$container);

		function sendFile(file) {
			fileDnD.showUpload();
			upload(file, function () {
				fileDnD.hideOverlay();
			})
		}

		function upload(file, callback) {
			gantt.importFromMSProject({
				data: file,
				callback: function (project) {
					if (project) {
						gantt.clearAll();

						if (project.config.duration_unit) {
							gantt.config.duration_unit = project.config.duration_unit;
						}

						for (key of project.data.data)
						{

							key.planned_start = key.start_date;
							key.responsible = "";

						}
						project.data.links = [];

						console.log(project.data);
					}


	/*
					var object = 'project.data';//этой переменной приравнивай свой объект, который получился
					var form_data = new FormData(); //создание формы для загрузки на сервер
					form_data.append('object', object);
					$.ajax({
					  url: 'object.php', // ссылка куда отправлять объект, кирилл скажет
					  dataType: 'text', // тип данных
					  cache: false, // сохранение кеша
					  contentType: false, //создание типа (по стандарту false)
					  processData: false, //установка определенного типа (по стандарту false)
					  data: form_data, // сами данные для отправки
					  type: 'post', // тип передачи данных на сервер
					  success: function(response)
						{ // после отправки данных, сервер отслыает обратно информацию либо необходимые параметры
					    //обработка полученных данных,
	  				}
	});



					if (callback)
						callback(project);
				}
			});
		}

		fileDnD.onDrop(sendFile);
		var form = document.getElementById("mspImport");
		form.onsubmit = function (event) {
			event.preventDefault();
			var fileInput = document.getElementById("mspFile");
			if (fileInput.files[0])
				sendFile(fileInput.files[0]);
		};
	*/
