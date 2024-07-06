import React, { useState } from 'react';
import { View, Button, Image, ScrollView } from 'react-native';
import DocumentScanner from 'react-native-document-scanner';
import RNFS from 'react-native-fs';
import { PDFDocument, rgb } from 'react-native-pdf-lib';

const App = () => {
  const [scannedImages, setScannedImages] = useState([]);
  
  const handleScan = (image) => {
    setScannedImages([...scannedImages, image]);
  };

  const createPDF = async () => {
    const pdfPath = `${RNFS.DocumentDirectoryPath}/scannedDocument.pdf`;
    const pdfDoc = await PDFDocument.create(pdfPath);

    scannedImages.forEach(async (image, index) => {
      const page = pdfDoc.addPage([595, 842]);
      page.drawImage(image.uri, {
        x: 0,
        y: 0,
        width: 595,
        height: 842,
      });
    });

    await pdfDoc.save();
    alert(`PDF guardado en ${pdfPath}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <DocumentScanner
        useBase64
        onPictureTaken={(data) => handleScan(data)}
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={false}
        quality={0.8}
        detectionCountBeforeCapture={5}
        detectionRefreshRateInMS={50}
      />
      <ScrollView>
        {scannedImages.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={{ height: 100, width: 100 }} />
        ))}
      </ScrollView>
      <Button title="Crear PDF" onPress={createPDF} />
    </View>
  );
};

export default App;
