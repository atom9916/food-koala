import SortItems from './sort';
import Genre from './genre';
import Area from './area';
import styles from 'styles/index.module.css';
import { SyntheticEvent } from 'react';

export default function Aside({
  handleGenreClick,
  handleAreaClick,
  sortMenu,
}: any) {
  return (
    <aside className={styles.aside}>
      <SortItems
        onChange={(e: any) => {
          const clickedValue = e.target.value;
          sortMenu(clickedValue);
        }}
      />
      <Genre
        onClick={(e: SyntheticEvent) => {
          const clickedId = e.currentTarget.id;
          handleGenreClick(clickedId);
        }}
      />
      <Area
        onClick={(e: SyntheticEvent) => {
          const clickedId = e.currentTarget.id;
          handleAreaClick(clickedId);
        }}
      />
    </aside>
  );
}
