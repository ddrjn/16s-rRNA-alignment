import igv from 'igv';
import React, { useEffect, useRef } from 'react';
import './IgvViewer.scss';
export const IgvViewer = () => {
	const containerRef = useRef(null);
	const options = {
		locus: 'NR_024570.1:330-780',
		genome: {
			id: 'Escherichia coli strain U 5/41 16S ribosomal RNA',
			fastaURL: '/ecoli.fasta',
			indexed: false,
			tracks: [
				{
					sourceType: 'file',
					name: '16S rDNA samples',
					url: '/output.bam',
					format: 'bam',
					indexURL: '/output.bam.bai',
					type: 'alignment',
					order: Number.MAX_VALUE,
					visibilityWindow: 300000000,
					height: 400,
					displayMode: 'SQUISHED',
					autoHeight: false,
				},
			],
		},
	};

	// Initialize the viewer
	// Because of strictmode, components are re-rendered twice so the useEffect will also be used twice.
	// because how igv works, it basically appends itself to the selected div, so this will happen twice in normal situation.
	//useState or other variable states do not help for same reason, so I guess this way it works :D
	useEffect(() => {
		let igvDiv = document.getElementById('igv-div');
		if (!igvDiv) {
			if (containerRef?.current) {
				igvDiv = document.createElement('div');
				igvDiv.id = 'igv-div';
				containerRef?.current.appendChild(igvDiv);
				igv.createBrowser(igvDiv, options);
			}
		}
	}, []);

	return <div id="igv-container" ref={containerRef}></div>;
};
