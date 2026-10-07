
//User api connection
const Api_connection = 'http://localhost:4000/api'


//------Get the social workers
export const HandleGetList = async (urlName) => {
  try {
  const response = await fetch(Api_connection + urlName);

    if (!response.ok) {
    throw new Error('Failed to get entry.');
    }
    const data = await response.json();
    return data.data ?? data;
  } catch (error) {
    throw error;
  }
};

//-----------------Add entry to the database ----------------
export const addEntryRequest = async (myEntry,urlName) => {
    const response = await fetch(Api_connection + urlName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myEntry)
    });
    if (!response.ok) {
        throw new Error('Unable to add request.');
    }
    const data = await response.json();
    return data;
};

  export const delete_Program = async (ProgramID) => {
    
    try {
      const response = await fetch(Api_connection + '/deleteProgram/' + ProgramID, {
        method: 'DELETE',
      })

      const data = await response.json().catch(() => ({}))
       return data

    } catch (error) {
      console.error('Error deleting program:', error)
    }
  }

//--------------Remove users-------------------
  export const delete_Users = async (userID) => {
    
    try {
      const response = await fetch(Api_connection + '/deleteUsers/' + userID, {
        method: 'DELETE',
      })

      const data = await response.json().catch(() => ({}));
       return data;

    } catch (error) {
      console.error('Error deleting program:', error);
    }
  }
  
  //----------------Display Gallery
export const getGallery = async () => {
    try {
        const response = await fetch(Api_connection + '/getPictures');
        if (!response.ok) {
            throw new Error('Failed to fetch Pictures');
        }
        const data = await response.json();
        return data.data ?? data;
    } catch (error) {
        throw error;
    }
};