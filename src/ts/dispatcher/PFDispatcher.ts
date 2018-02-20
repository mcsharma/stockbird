import {Dispatcher} from 'flux';
import {PFAction} from '../types/PFAction';

const PFDispatcher = new Dispatcher<PFAction>();

export {PFDispatcher};
