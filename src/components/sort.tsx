import styles from 'styles/SortItems.module.css';

export default function SortItems({ onChange }: any) {
  return (
    <div className={styles.div}>
      <p>▶︎メニューを並び替える</p>
      <select name="sorting" id="sorting" onChange={onChange}>
        <option value="new">新着順</option>
        <option value="inexpensive">安い順</option>
        <option value="expensive">高い順</option>
      </select>
    </div>
  );
}
