package com.memora.shared;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Component;

@Component
public class QrCodeGenerator {

	public byte[] generatePng(String content, int size) {
		try {
			BitMatrix matrix = new QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, size, size);
			BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			ImageIO.write(image, "PNG", outputStream);
			return outputStream.toByteArray();
		} catch (WriterException | IOException exception) {
			throw new IllegalStateException("Unable to generate QR code", exception);
		}
	}
}
