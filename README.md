# 16s-rRNA-alignment

In this small project, I will describe how the samples were prepared and aligned to a template 16rDNA, and also how to use the sample visualization web app of the repo. The point of this is to visually see how variable regions of 16S rRNA vay between species.

### How to deploy web app

The simple web app is built using vite and React/js (I know I could have used vanila but I felt fancy).
App uses the [IGV.js](https://github.com/igvteam/igv.js) library to display sequences and alignments.

you will need a node.js on your system.

```
cd 16S-RRNA-VIZ
npm install
npm run dev
```

That is it, it will deploy a server on (most likely) `http://127.0.0.1:5173/`. Go to that URL and you will see the igv viewer (loading sequences can take up to 5 seconds) similar to this:

![Preview](/assets/preview.png)

### Data Preparation:

in the paper ['Chronic alcohol-induced dysbiosis of the gut microbiota and gut metabolites impairs sperm quality in mice'](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9751024/), among many other things, authors use 16S rRNA sequencing to detect microbiota compsition in (control and alcoholic) guts of mice. To do so, they use the mice fecal matter for their source. authors have generated gigabytes of data, but for this project, we are going to use very small ammount.

After extracting the genetic material from fecal mater, authors used two primers (341F: CCTACGGGNGGCWGCAG and 806R: GGACTACHVGGGTATCTAAT) for PCR, which correspond to 16s rDNA and specifically amplify the region containing V3 and V4 highly variable sequences (total length should be around 440-450).

Then after some additional steps like purifications, resulting DNA was sequenced, specifically, each time they had the forward and reverse run, each to be about 250bp in length, overlapping somewhere in the middle. Authors have generated many reads from sequencing, but for the sake of simplicity, I only use one, specifically, results for control mice `CRR618068`. both forward and reverse mates can be downloaded from [ngdc.cncb.ac.cn](https://ngdc.cncb.ac.cn/gsa/browse/CRA009014/CRR618068).

As said these files contain the mates for PCR runs so first they need to be combined, and then processed.

for this first step I will be using progam MOTHUR for preprocessing, which can be downloaded at [https://mothur.org/](https://mothur.org/), [bowtie2](https://github.com/BenLangmead/bowtie2) for alignment and [SAMTOOLS](http://www.htslib.org/) for file conversions.

Download the MOTHUR, put it into the working directory and run.

First we need mothur to know what fastq files it will be working on:
```
make.file(inputdir=., type=fastq, prefix=stability)
```

Then, MOTHUR need to create contigs:
```
make.contigs(file=stability.files)
```

We can inspect the generated contigs using command:
```
summary.seqs(fasta=stability.trim.contigs.fasta, count=stability.contigs.count_table)
```
this will output the following table:
```
                Start   End     NBases  Ambigs  Polymer NumSeqs
Minimum:        1       82      82      0       3       1
2.5%-tile:      1       404     404     0       4       2816
25%-tile:       1       405     405     0       4       28159
Median:         1       423     423     0       5       56317
75%-tile:       1       428     428     0       5       84475
97.5%-tile:     1       429     429     2       6       109817
Maximum:        1       439     439     118     70      112632
Mean:           1       416     416     0       4
```

we can see that although majority of the data is good, there are couple outliers so we should remove them

```
screen.seqs(fasta=stability.trim.contigs.fasta, count=stability.contigs.count_table, maxambig=0, maxlength=500, maxhomop=8, end=400)
```

Lots of those sequences will be the same, so we can generate a set of unique sequences, which in this case, will half the size

```
unique.seqs(fasta=stability.trim.contigs.good.fasta, count=stability.contigs.good.count_table)
```

After this, our data will look like this:
```
                Start   End     NBases  Ambigs  Polymer NumSeqs
Minimum:        1       400     400     0       3       1
2.5%-tile:      1       404     404     0       4       2548
25%-tile:       1       406     406     0       4       25475
Median:         1       423     423     0       5       50949
75%-tile:       1       428     428     0       5       76423
97.5%-tile:     1       429     429     0       6       99349
Maximum:        1       439     439     0       8       101896
Mean:           1       416     416     0       4
```

Our job with mothur is done.

#### Alignment

First, we need the reference genome. In this case, I chose the E.COLI sequence of the 16S rRNA gene, downloaded from [NCBI](https://www.ncbi.nlm.nih.gov/nuccore/NR_024570.1?report=fasta)

then we need to index this fasta.

```
bowtie2-build ecoli.fasta ecoli_index
```

now we can Align, but we need to consider that we are looking at the highly variable region, therefore, the 'Alignment score' can be low. to overcome this, we should decrease the score threshold, but not to the point where it produces nonsense.

```
bowtie2 -x ecoli_index -f stability.trim.contigs.good.unique.fasta -S aligned.sam --un unaligned.fasta --score-min L,-0.6,-2
```
this will produce the *sam* file. finally, we can filter it so no unaligned sequences make through, sort it and save it as a *bam* file.

```
samtools view -h aligned.sam | samtools sort | samtools view -b -F 4 - > output.bam
```

and lastly, we index the bam file:
```
samtools index output.bam
```

the files we need will be 
>output.bam

>output.bam.bai

>ecoli.fasta