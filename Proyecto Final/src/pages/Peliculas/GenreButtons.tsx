import React from 'react';

interface GenreButtonsProps {
  genres: { id: number; name: string }[];
  onSelectGenre: (genreId: number) => void;
}

const GenreButtons: React.FC<GenreButtonsProps> = ({ genres, onSelectGenre }) => {
  return (
    <div className='container mt-2 mb-3'>
      <p>Filtrar por género:</p>
      {genres.length > 0 ? (
        <select id="genreSelect" className='form-select' onChange={(e) => onSelectGenre(Number(e.target.value))}>
          <option value="">Todos</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      ) : (
        <p>Cargando géneros...</p>
      )}
    </div>
  );
};

export default GenreButtons;
