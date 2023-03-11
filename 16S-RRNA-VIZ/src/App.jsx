import { useState } from 'react';
import './App.scss';
import { Header, IgvViewer, IgvViewerSeparate } from './components';

function App() {
	const [exampleState, setExampleStat] = useState(false);
	//false means all alignments, true means separate alignments

	return (
		<>
			<Header />
			<div className="state-button-container">
				<button className="state-switch-button" onClick={() => setExampleStat(prev => !prev)}>
					{exampleState ? 'Switch to all alignments view' : 'Switch to separate alignments view'}
				</button>
			</div>

			{exampleState ? <IgvViewerSeparate /> : <IgvViewer />}
		</>
	);
}

export default App;
