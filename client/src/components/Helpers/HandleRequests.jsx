
//User api connection
const Api_connection = 'http://localhost:4000/api'

//----------------Get all the stories/Testimonilas
export const getStories = async () => {
    try {
        const response = await fetch(Api_connection + '/getStories');
        if (!response.ok) {
            throw new Error('Failed to fetch stories');
        }
        const data = await response.json();
        return data.data ?? data;
    } catch (error) {
        throw error;
    }
};

//------Get the available programs-------------
export async function getPrograms() {

    const response = await fetch(Api_connection + '/getPrograms');

    if (!response.ok) {
        throw new Error('Failed to fetch programs');
    }

    const data = await response.json();

    return data.data ?? data;
}

//-----------------Add a single story----------------
export const addStory = async (myStory) => {
    const response = await fetch(Api_connection + '/AddStory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myStory)
    });
    if (!response.ok) {
        throw new Error('Unable to add story');
    }
    const data = await response.json();
    return data;
};

//---------------
    export const AddPrograms = async (program) => {

      try {
        const response = await fetch(Api_connection + '/AddPrograms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(program)
        })

        if (!response.ok) throw new Error('Unable to add program.')

        const savedProgram = await response.json()
        return savedProgram;
        
      } catch (error) {
        setMessage(error.message)
      }
  }

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
    ///_-----------------add pictures----
export const add_Gallery = async (ThisImage) => {
  try {
    const response = await fetch(Api_connection + '/AddPictures', {
      method: 'POST',
      body: ThisImage
    })

    if (!response.ok) {
      throw new Error('Unable to add gallery image.')
    }

    const savedGallery = await response.json()

    return savedGallery

  } catch (error) {
    throw error
  }
}

  