jQuery(document).ready(function($)
{
	var use_x_account = 0;

	function wc_gateway_xrp_qrcode(account, tag, amount)
	{
		$('#wc_xrp_qrcode').empty();
		if (account.substring(0,1) == 'r') {
			var qrdata = account + "?dt=" + tag + "&amount=" + amount;
		} else {
			var qrdata = account + "?amount=" + amount;
		}
		var qrcode = new QRCode(document.getElementById("wc_xrp_qrcode"), {
			text: qrdata,
			width: 256,
			height: 256,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.M
		});
	}

	function update_balance()
	{
		jQuery.ajax({
			"url": ajax_object.ajax_url,
			"data": {
				"action": "xrp_checkout",
				"order_id": ajax_object.order_id
			},
			"method": "POST",
			"dataType": "json",
			"success": function(data) {
				var regenqr=false;
				if (use_x_account) {
					data.xrp_account = data.xrp_x_account;
				}
				if ($('#xrp_account').text() != data.xrp_account) {
					$('#xrp_account').text(data.xrp_account);
					regenqr=true;
				}
				if ($('#destination_tag').text() != data.tag) {
					$('#destination_tag').text(data.tag);
					regenqr=true;
				}
				if ($('#xrp_total').text() != data.xrp_total) {
					$('#xrp_total').text(data.xrp_total);
				}
				if ($('#xrp_received').text() != data.xrp_received) {
					$('#xrp_received').text(data.xrp_received);
				}
				if ($('#xrp_remaining').text() != data.xrp_remaining) {
					$('#xrp_remaining').text(data.xrp_remaining);
					regenqr=true;
				}
				if ($('#xrp_status').text() != data.status) {
					$('#xrp_status').text(data.status);
				}
				if (data.raw_status != 'pending') {
					clearTimeout(pollTimer);
					$('#wc_xrp_qrcode').empty();
				} else if (regenqr) {
					wc_gateway_xrp_qrcode(
						data.xrp_account,
						data.tag,
						data.xrp_remaining
					);
				}
			}
		});
	}

	$('#wc_xrp_qrcode, #xrp_account').on('click', function()
	{
		if (use_x_account) {
			use_x_account = 0;
		} else {
			use_x_account = 1;
		}

		update_balance();
	});

	var pollTimer = setInterval(update_balance, 4000);

	wc_gateway_xrp_qrcode(
		$('#xrp_account').text(),
		$('#destination_tag').text(),
		$('#xrp_remaining').text()
	);
});
