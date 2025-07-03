export const uploadImage = async(
    uri: string, 
    type: string = 'image/jpeg', 
    name: string = 'upload.jpg'
) => {
    const formData = new FormData();

    formData.append('file', {
        uri,
        type,
        name,
    } as any);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export const uploadDocument = async(
    uri: string, 
    type: string = 'application/octet-stream', 
    name: string = 'upload.pdf'
) => {
    const formData = new FormData();

    formData.append('file', {
        uri,
        type,
        name,
    } as any);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error uploading document:", error);
        throw error;
    }
}

export const getDadJoke = async () => {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke', {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch dad joke: ${response.status}`);
        }

        const jokeData = await response.json();
        return jokeData.setup + "\n" + jokeData.punchline;

    } catch (error) {
        console.error("Error fetching dad joke:", error);
        throw error;
    }
};
