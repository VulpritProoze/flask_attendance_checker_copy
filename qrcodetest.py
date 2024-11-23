import qrcode, qrcode.image.svg


factory = qrcode.image.svg.SvgImage
img = qrcode.make('Hello, world', image_factory=factory)
img.save('static/img/bg-img/qrcodes/qr.svg')