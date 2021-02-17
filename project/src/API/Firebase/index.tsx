import React from 'react';
import Firebase from './firebase';

export default Firebase;
export const FirebaseObj = new Firebase();
export const FirebaseContext = React.createContext(FirebaseObj);