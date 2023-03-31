import Image from 'next/image';
import styles from 'styles/Search_modal.module.css';
import Aside from './Aside';
import { useKey } from 'react-use';

export default function SearchModal({
  openSearchModal,
  searchModal,
}: any) {
  return (
    <>
      <Image
        className={styles.search_icon}
        src="/images/search-icon.png"
        alt="search_icon"
        width={25}
        height={25}
        onClick={openSearchModal}
      />
      <div className={styles[searchModal]}>
        <Aside />
      </div>
    </>
  );
}
