import styles from './Cell.module.css'

type CellProps = {
  children?: React.ReactNode
}

const Cell = ({ children }: CellProps) => {
  return <div className={styles.cell}>{children}</div>
}

export default Cell
