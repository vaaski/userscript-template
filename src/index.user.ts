import styles from "../styles/index.css"
import { styleInject } from "./util"

styleInject("index", styles)

alert(`Userscript loaded at ${location.href}`)
