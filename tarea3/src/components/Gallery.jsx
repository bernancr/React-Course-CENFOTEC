import React, { useState, useEffect } from 'react';

function Gallery() {
  const [albumsData, setAlbumsData] = useState([]);
  const [photosData, setPhotosData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState (true)
  const [galleryData, setGalleryData] = useState([]);

useEffect(() => {
//Get Data of Albums, Photos and Users
  const bringData = async () => {
    try{  
      //Users Data
      const usersURL = await fetch('https://jsonplaceholder.typicode.com/users');
      const usersData = await usersURL.json();
      setUsersData(usersData);
      console.log('USERS DATA', usersData); 

      //Album Data
      const albumsURL = await fetch('https://jsonplaceholder.typicode.com/albums');
      const albumsData = await albumsURL.json();
      setAlbumsData(albumsData);
      console.log('ALBUMS DATA:', albumsData); 

      //Photos Data
      const photosURL = await fetch('https://jsonplaceholder.typicode.com/photos');
      const photosData = await photosURL.json();
      setPhotosData(photosData);
      console.log('PHOTOS DATA:', photosData);

      //Iteration
      const albumPhotosUsers = albumsData.map((album) => {
        const user = usersData.find(user => user.id === album.userId);
        const photosInAlbum = photosData.filter(photo => photo.albumId === album.id);
        return { album, user, photos: photosInAlbum };
      });
      
      console.log('USERS:', albumPhotosUsers);

      setGalleryData(albumPhotosUsers);

    }  catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false);
    }
  }

  bringData();


  }, []);

  return (   
    <div>
      <h1 className='mt-4 text-center'>Galeria de Fotos</h1>
      {
        galleryData.map(
          gallery => (
            <section className='m-4 pb-4' key={gallery.album.title}>
              <div className='bg-white border rounded-5'>
                <section className='m-4 p-4 text-center'>
                  <h2>Álbum: {gallery.album.title}</h2>
                  <p>Usuario: {gallery.user.name}</p>
                  <ul className='d-flex flex-wrap'>
                    {gallery.photos.map(
                      photo => (
                        <li key={photo.id}>
                          <img width="40px" src={photo.thumbnailUrl} alt={photo.title}/>
                        </li>
                      )
                    )}         
                  </ul>
                </section>
              </div>
            </section>
          )
        )
      }
    </div>
  );




};


export default Gallery;
