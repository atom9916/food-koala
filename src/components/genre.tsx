// Genreコンポーネントの作成
import Image from 'next/image';
import useSWR from 'swr';
import styles from 'styles/Genre.module.css';
import type { Genre } from 'types/genre';
import { Fetcher } from 'lib/Fetcher';

export default function Genre({ onClick }: any) {
  const { data, error } = useSWR('/api/genre', Fetcher, {
    revalidateOnMount: true,
  });

  if (error) return <div>エラーです</div>;
  if (!data) return <div>データがありませんでした</div>;

  return (
    <>
      <p className={styles.p}>▶︎ジャンルで絞り込む</p>
      <div className={styles.genrelist}>
        <div className={styles.all_genre}>
          {data.map((genre: Genre) => (
            <div className={styles.genre} key={genre.id}>
              <button id={`${genre.id}`} onClick={onClick}>
                <Image
                  src={genre.image_url}
                  alt="genre-icon"
                  width={300}
                  height={300}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
