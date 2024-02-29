'use strict';

const projects = [
	{
		name: 'ThesisManagement',
		description:
			"ThesisManagement revitalizes Politecnico di Torino's thesis system, prioritizing a user-friendly experience. Focus includes improving frontend/backend, modernizing the interface, and streamlining system functions.",
		technologies: ['React', 'Figma', 'JavaScript', 'Bootstrap', 'Docker', 'Node'],
		// technologies: ['React'],
		link: 'https://github.com/gerardomaruotti/ThesisManagement',
	},
	{
		name: 'CodeMastery',
		description:
			'The project aims to simplify computer science education for non-STEM university students, focusing on mastering programming skills for informatics exams. The goal is to assist students in overcoming challenges related to learning basic computer science concepts and programming skills, enabling them to excel in exams and prepare for a successful professional future aligned with modern demands.',
		technologies: ['React', 'Figma', 'JavaScript', 'Node', 'Tailwind'],
		// technologies: ['React'],
		link: 'https://github.com/gerardomaruotti/CodeMastery',
	},
	{
		name: 'EZWallet',
		description:
			'EZWallet is a web application designed to help individuals and families keep track of their expenses. Users can enter and categorize their expenses, allowing them to quickly see where their money is going. EZWallet is a powerful tool for those looking to take control of their finances and make informed decisions about their spending.',
		technologies: ['Node', 'JavaScript', 'Docker'],
		// technologies: ['Node'],
		link: 'https://github.com/gerardomaruotti/EzWallet',
	},
	{
		name: 'CMSmall',
		description:
			'CMSmall is a web application for a small Content Management System. The CMS has a back-office (i.e., the administrative/management area) and a front-office (i.e., the version of the web application visible to everybody, without authentication). In the back-office, the CMS allows any authenticated user to create and manage pages.',
		technologies: ['React', 'JavaScript', 'Bootstrap', 'Node'],
		// technologies: ['React'],
		link: 'https://github.com/gerardomaruotti/CMSmall',
	},
	{
		name: 'Graph Partitioner',
		description:
			'In computer science, it is common to work with large graphs that need to be divided into non-overlapping sections, known as partitions. This process is called p-way partitioning. The aim of the project is to minimize the sum of the weights of edges that cross between partitions and balance the sum of weights of nodes in each partition.',
		technologies: ['C++', 'C'],
		link: 'https://github.com/gerardomaruotti/Graph-Partitioner',
	},
	{
		name: 'Tamagotchi',
		description:
			'LandTiger Tamagotchi is an engaging virtual pet simulation game developed in C and Assembly language, deployed on a LandTiger development board. It combines the classic Tamagotchi concept of nurturing and taking care of a virtual pet with the powerful capabilities of the LandTiger development board.',
		technologies: ['C', 'ASM'],
		link: 'https://github.com/gerardomaruotti/Tamagotchi',
	},
	// {
	// 	name: 'NBA Stats',
	// 	description: 'SwiftUI app which displays NBA games and teams statistics in real time using new iOS technologies and frameworks.',
	// 	technologies: ['Swift', 'Apple', 'API'],
	// 	link: 'https://github.com/gerardomaruotti/NBA-Stats',
	// },
	{
		name: 'Temperature Manager',
		description:
			'This Python project demonstrates the application of MQTT for data management. It presents an interactive program structure with initialization, user input handling for data collection control, and a termination process.',
		technologies: ['Python', 'MQTT'],
		link: 'https://github.com/gerardomaruotti/Temperature-Manager',
	},
	{
		name: 'Language Executor',
		description: 'Custom Language Compiler and Executor written in Java using Jflex and Cup.',
		technologies: ['Java', 'Jflex', 'Cup'],
		link: 'https://github.com/gerardomaruotti/Language-Executor',
	},
];

/**
 * Creates a project card element based on the given project object.
 * The card element contains various HTML elements such as divs, headings, icons, and buttons,
 * which are dynamically created and styled based on the project data.
 *
 * @param {Object} project - The project object containing the project details such as name, technologies, description, and link.
 * @returns {HTMLElement} - The dynamically created project card element.
 */
function createProjectCard(project) {
	const card = document.createElement('div');
	card.classList.add(
		'card',
		'max-w-xl',
		'mx-auto',
		'my-4',
		'p-6',
		'bg-neutral-200',
		'dark:bg-neutral-700',
		'border',
		'border-transparent',
		'shadow',
		'hover:shadow-md',
		'transition',
		'duration-200',
		'rounded-xl',
		'hover:border-sky-300'
	);

	const cardBody = document.createElement('div');
	cardBody.classList.add('card-body');

	const cardTitle = document.createElement('h2');
	cardTitle.classList.add('card-title', 'text-xl', 'font-semibold', 'text-center');
	cardTitle.textContent = project.name;

	const techList = document.createElement('div');
	techList.classList.add('tech-list', 'flex', 'justify-center', 'items-center', 'py-2');

	if (project.technologies) {
		project.technologies.forEach((tech) => {
			let iconName;
			switch (tech.toLowerCase()) {
				case 'figma':
					iconName = 'fa-figma';
					break;
				case 'react':
					iconName = 'fa-react';
					break;
				case 'javascript':
					iconName = 'fa-square-js';
					break;
				case 'bootstrap':
					iconName = 'fa-bootstrap';
					break;
				case 'docker':
					iconName = 'fa-docker';
					break;
				case 'node':
					iconName = 'fa-node';
					break;
				case 'c':
					iconName = 'fa-c';
					break;
				case 'swift':
					iconName = 'fa-swift';
					break;
				case 'apple':
					iconName = 'fa-apple';
					break;
				case 'python':
					iconName = 'fa-python';
					break;
				case 'java':
					iconName = 'fa-java';
					break;
				default:
					break;
			}

			if (iconName) {
				const techIcon = document.createElement('i');
				techIcon.classList.add('fa-brands', iconName, 'text-2xl', 'mx-1');
				// if (index > 0) {
				// 	techIcon.classList.add('hidden', 'md:block');
				// }
				techList.appendChild(techIcon);
			}
		});
	}

	const headerDiv = document.createElement('div');
	headerDiv.classList.add('flex', 'flex-col', 'justify-between', 'items-center', 'flex-wrap');

	const cardText = document.createElement('p');
	cardText.classList.add('card-text', 'py-2', 'text-center');
	cardText.textContent = project.description;

	const buttonContainer = document.createElement('div');
	buttonContainer.classList.add('flex', 'justify-center', 'items-center');

	const cardLink = document.createElement('button');
	cardLink.classList.add('btn', 'bg-sky-600', 'hover:bg-sky-700', 'text-white', 'px-4', 'py-2', 'rounded-full', 'transition');
	cardLink.href = project.link;
	cardLink.textContent = 'View on GitHub';

	cardLink.addEventListener('click', () => {
		window.open(project.link, '_blank');
	});

	headerDiv.appendChild(cardTitle);
	headerDiv.appendChild(techList);
	cardBody.appendChild(headerDiv);
	cardBody.appendChild(cardText);
	cardBody.appendChild(buttonContainer);
	buttonContainer.appendChild(cardLink);
	card.appendChild(cardBody);

	return card;
}

function main() {
	const projectsContainer = document.getElementById('projects-section');

	projects.forEach((project) => {
		const projectCard = createProjectCard(project);
		projectsContainer.appendChild(projectCard);
	});
}

main();
