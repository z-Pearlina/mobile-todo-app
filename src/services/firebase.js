import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Initialize Firebase services
const auth = getAuth();
const todosCollection = collection(db, 'todos');

// --- AUTH FUNCTIONS ---

export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};


// --- FIRESTORE CRUD FUNCTIONS ---

export const getTodos = (userId, callback) => {
  const q = query(todosCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const todos = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        dueDate: data.dueDate?.toDate(),
      };
    });
    callback(todos);
  }, (error) => {
    console.error("Error fetching todos: ", error);
    callback([]);
  });

  return unsubscribe;
};

export const getTodoById = async (todoId) => {
  try {
    const docRef = doc(db, 'todos', todoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        dueDate: data.dueDate?.toDate(),
      };
    } else {
      console.warn(`No todo document found with id: ${todoId}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching single todo:', error);
    throw error;
  }
};

export const addTodo = (userId, text, dueDate) => {
  return addDoc(todosCollection, {
    userId,
    text,
    completed: false,
    createdAt: serverTimestamp(),
    dueDate: dueDate || null,
  });
};

/**
 * CORRECTED: Toggles the 'completed' status of a specific todo.
 * It now correctly finds the document by its unique ID in the 'todos' collection.
 * The userId argument is kept for consistency but is not part of the document path.
 */
export const toggleTodo = (userId, todoId, currentStatus) => {
  const todoRef = doc(db, 'todos', todoId);
  return updateDoc(todoRef, {
    completed: !currentStatus,
  });
};

/**
 * CORRECTED: Updates details of a todo item.
 * It now correctly finds the document by its unique ID in the 'todos' collection.
 */
export const updateTodoDetails = (userId, todoId, details) => {
  const todoRef = doc(db, 'todos', todoId);
  return updateDoc(todoRef, details);
};

/**
 * CORRECTED: Deletes a todo document from Firestore.
 * It now correctly finds the document by its unique ID in the 'todos' collection.
 */
export const deleteTodo = (userId, todoId) => {
  const todoRef = doc(db, 'todos', todoId);
  return deleteDoc(todoRef);
};