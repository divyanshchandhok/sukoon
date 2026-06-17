//  ┌┬┐┬ ┬┌─┐┌┬┐┌─┐
//  │ ├─┤├┤ │││├┤
//  ┴ ┴ ┴└─┘┴ ┴└─┘
// Set theme based on Configurations and Preferences

const themeToggle = document.querySelector('#themeButton');

const getDefaultTheme = () => {
	let isDark = false;
	if (CONFIG.autoChangeTheme) {
		if (CONFIG.changeThemeByOS) {
			isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		} else if (CONFIG.changeThemeByHour && !CONFIG.changeThemeByOS) {
			const date = new Date();
			const hours = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
			const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
			const currentTime = hours + ':' + minutes;
			if (currentTime >= CONFIG.hourDarkThemeActive) {
				isDark = true;
			} else if (currentTime >= CONFIG.hourDarkThemeInactive) {
				isDark = false;
			}
		}
	}
	return isDark ? 'dark' : 'light';
};

const enableDark = () => {
	document.documentElement.classList.add('darktheme');
	themeToggle.innerHTML = `<i id="themeIcon" class="ph ph-sun"></i>`;
};

const disableDark = () => {
	document.documentElement.classList.remove('darktheme');
	themeToggle.innerHTML = `<i id="themeIcon" class="ph ph-moon"></i>`;
};

const initTheme = () => {
	// Migrate old key if present
	const oldTheme = localStorage.getItem('darkTheme');
	if (oldTheme !== null) {
		if (oldTheme === 'enabled') {
			localStorage.setItem('userOverrideTheme', 'dark');
			localStorage.setItem('lastDefaultTheme', 'light'); // assume they overrode it
		}
		localStorage.removeItem('darkTheme');
	}

	const currentDefault = getDefaultTheme();
	const lastDefault = localStorage.getItem('lastDefaultTheme');
	let userOverride = localStorage.getItem('userOverrideTheme');
	
	let finalTheme = currentDefault;
	
	if (lastDefault === currentDefault) {
		if (userOverride === 'dark') {
			finalTheme = 'dark';
		} else if (userOverride === 'light') {
			finalTheme = 'light';
		}
	} else {
		localStorage.removeItem('userOverrideTheme');
		userOverride = null;
	}
	
	localStorage.setItem('lastDefaultTheme', currentDefault);
	
	if (finalTheme === 'dark') {
		document.documentElement.classList.add('notransition');
		enableDark();
		document.documentElement.classList.remove('notransition');
	} else {
		disableDark();
	}
};

initTheme();

themeToggle.addEventListener('click', () => {
	const currentDefault = getDefaultTheme();
	let newTheme;
	
	if (document.documentElement.classList.contains('darktheme')) {
		disableDark();
		newTheme = 'light';
	} else {
		enableDark();
		newTheme = 'dark';
	}
	
	if (newTheme === currentDefault) {
		localStorage.removeItem('userOverrideTheme');
	} else {
		localStorage.setItem('userOverrideTheme', newTheme);
	}
	localStorage.setItem('lastDefaultTheme', currentDefault);
});

if (CONFIG.imageBackground) {
	document.body.classList.add('withImageBackground');
}
