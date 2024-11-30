import { baseUrl } from '@/lib/helpers/constants/baseUrl';
import axios from 'axios';

export const client = axios.create({
  baseURL: baseUrl,
});
