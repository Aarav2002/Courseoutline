import './App.css';
import CourseBuilder from './components/modules/CourseBuilder';
import { CourseBuilderProvider } from './contexts/CourseBuilderContext';

function App() {
  return (
    <div className="app">
      <CourseBuilderProvider>
        <CourseBuilder />
      </CourseBuilderProvider>
    </div>
  );
}

export default App;
