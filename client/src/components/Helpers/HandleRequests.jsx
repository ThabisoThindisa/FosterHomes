
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')


//------Get the social workers
export const HandleGetList = async (urlName) => {
  try {
  const response = await fetch(API_URL + urlName, {
    credentials: 'include'
  });

    if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to get entry.');
    }
    const data = await response.json();
    return data.data ?? data;
  } catch (error) {
    throw error;
  }
};

//-----------------Add entry to the database ----------------
export const addEntryRequest = async (myEntry,urlName) => {
    const response = await fetch(API_URL + urlName, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myEntry)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || 'Unable to add request.');
    }
    return data;
};

  export const delete_Program = async (ProgramID) => {
    
    try {
      const response = await fetch(API_URL + '/deleteProgram/' + ProgramID, {
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
      const response = await fetch(API_URL + '/deleteUsers/' + userID, {
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
        const response = await fetch(API_URL + '/getPictures');
        if (!response.ok) {
            throw new Error('Failed to fetch Pictures');
        }
        const data = await response.json();
        return data.data ?? data;
    } catch (error) {
        throw error;
    }
};