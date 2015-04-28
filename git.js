var repoHTML = "User: <input type='text' name='user' value='adrianvinuelas'" +
    "id='user' size='10' />" +
    "Repo: <input type='text' name='repo' value='X-Nav-OAuth-GitHub-Fichero'" +
    "id='repo' size='10' />" +
    "<button type='button' id='botonform'>Grab repo data</button>" +
    "<div id='repodata'/>";

var github;
var repo;

function showFiles(error, contents) {
    if (error) {
		$("#contenidorepo").html("<p>Error code: " + error.error + "</p>");
    } else {
		var files = [];
		for (var i = 0, len = contents.length; i < len; i++) {
		    files.push(contents[i].name);
		};
		$("#contenidorepo").html("<p>Files:</p>" +
				  "<ul id='files'><li>" +
				  files.join("</li><li>") +
				  "</li></ul>"
		);
    };
}

function obtenerRepo(){
	var username = $("#user").val();
	var reponame = $("#repo").val();
	repo = github.getRepo(username, reponame);
	repo.show(function(err, repo1) {
		if (err) {
			$("#inforepo").html("<p>Error code: " + err.error + "</p>");
		} else {
			var info = "<p>Info del repositorio:</p>" +
				   "<ul><li>Nombre: " + repo1.full_name + "</li>" +
				   "<li>Descripcion: " + repo1.description + "</li>" +
				   "<li>Creado: " + repo1.created_at + "</li></ul>"
			$("#inforepo").html(info);
			repo.contents('master', '', showFiles);
			$("#escritura").show();
			$("#botonwrite").click(escribirenrepo);
			$("#botonread").click(readrepo);
		}
	});
};


function escribirenrepo(){
	repo.write('master', $("#fich").val(), $("#conte").val(), 'Nuevo commit', function(err) {});
	$("#hecho").html("Escritura realizada");
};

function readrepo(){
	console.log("voy a leer de = " + $("#fich").val());
	repo.read('master', $("#fich").val(), function(err, data) {
		$("#conte").val(data);
	});
}

jQuery(document).ready(function() {
	$("#escritura").hide();
	$("#botontoken").click(obtenerRepo);

	hello.init({
		github : "2fd3956542947f2cd70e" //poner el identificador de mi aplicacion
	},{
		redirect_uri : "redirect.html",
		oauth_proxy : "https://auth-server.herokuapp.com/proxy",
		scope : "publish_files",
	});
	console.log ("llego hasta aqui");
	access = hello("github");
	console.log ("llego hasta aqui 1111111");
  	access.login({response_type: 'code'}).then( function(){
  		console.log ("llego hasta aqui 222222");
		auth = hello("github").getAuthResponse();
		console.log ("llego hasta aqui 3333333");
		token = auth.access_token; //cojo el token de acceso a la aplicacion
		console.log (token);
		github = new Github({
		    token: token,
		    auth: "oauth"
		});
		$("#repoform").html(repoHTML);
		$("#botonform").click(obtenerRepo);
	}, function( e ){
		alert('Signin error: ' + e.error.message);
    });
});
