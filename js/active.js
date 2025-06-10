$(function(){
	
	var note = $('#note'),
		// 1 de agosto de 2025, 00:00:00
		ts = new Date(2025, 7, 1, 0, 0, 0).getTime(),
		newYear = false;
		
	$('#countdown').countdown({
		timestamp	: ts,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			message += days + " day" + ( days==1 ? '':'s' ) + ", ";
			message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
			message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
			message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br />";
			
			message += "¡DÍA DE LANZAMIENTO DE LA WEB!";
			
			note.html(message);
		}
	});
	
});