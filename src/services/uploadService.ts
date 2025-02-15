
export const sendToN8N = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);
  
  try {
    console.log('Sending POST request to N8N with file:', file.name);
    const response = await fetch('https://n8n.traddy.fr/webhook/3d048e76-9ee2-4705-8953-34d94f770a8c', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('N8N Response status:', response.status);
      console.error('N8N Response text:', await response.text());
      console.error('N8N Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error('Failed to send file to N8N');
    }

    const responseData = await response.json();
    console.log('N8N Response:', responseData);

    return true;
  } catch (error) {
    console.error('Error sending file to N8N:', error);
    console.error('Error details:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    throw error;
  }
};

export const countCsvLines = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      resolve(Math.max(0, lines.length - 1));
    };
    reader.readAsText(file);
  });
};
