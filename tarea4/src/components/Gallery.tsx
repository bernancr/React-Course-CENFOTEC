import React, { useState, useEffect } from 'react';

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
}

interface GalleryItem {
  album: Album;
  user: User;
  photos: Photo[];
}

const Gallery: React.FunctionComponent = () => {
  const [albumsData, setAlbumsData] = useState<Album[]>([]);
  const [photosData, setPhotosData] = useState<Photo[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const bringData = async () => {
      try {
        const usersURL = await fetch('https://jsonplaceholder.typicode.com/users');
        const usersData = await usersURL.json();
        setUsersData(usersData);

        const albumsURL = await fetch('https://jsonplaceholder.typicode.com/albums');
        const albumsData = await albumsURL.json();
        setAlbumsData(albumsData);

        const photosURL = await fetch('https://jsonplaceholder.typicode.com/photos');
        const photosData = await photosURL.json();
        setPhotosData(photosData);

        const albumPhotosUsers = albumsData.map((album: Album) => {
          const user = usersData.find((user: User) => user.id === album.userId);
          const photosInAlbum = photosData.filter((photo: Photo) => photo.albumId === album.id);
          return { album, user, photos: photosInAlbum } as GalleryItem;
        });

        setGalleryData(albumPhotosUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    bringData();
  }, []);

  return (
    <div>
      <h1 className='mt-4 text-center'>Galeria de Fotos</h1>
      {galleryData.map((gallery: GalleryItem) => (
        <section className='m-4 pb-4' key={gallery.album.title}>
          <div className='bg-white border rounded-5'>
            <section className='m-4 p-4 text-center'>
              <h2>Álbum: {gallery.album.title}</h2>
              <p>Usuario: {gallery.user.name}</p>
              <ul className='d-flex flex-wrap'>
                {gallery.photos.map((photo: Photo) => (
                  <li key={photo.id}>
                    <img width='40px' src={photo.thumbnailUrl} alt={photo.title} />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Gallery;