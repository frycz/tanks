$(function () {

                        $('#fcb').hide();
                        
			$('#fc').click(function () {

				screenfull.request($('body')[0]);
                                
                                $('#fcb').show();
                                $('#fc').hide();

			});
                        $('#fcb').click(function () {

				screenfull.exit();
                                
                                $('#fcb').show();
                                $('#fc').hide();

			});
                 });