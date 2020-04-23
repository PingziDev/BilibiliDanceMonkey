import './content-script.css';
import { getVid, isBilibili } from '../utils/bilibili';

if (isBilibili()) {
  const vid = getVid();
  console.log('vid===', vid);
}

