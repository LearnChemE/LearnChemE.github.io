

export function initHamburgerMenu() {
    // Create the button element
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-button';
    btn.innerHTML = `<div>☰</div>`;

    // Create the menu element
    const menu = document.createElement("menu");
    menu.className = "menu-content";
    menu.innerHTML = `
            <button id="dir-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#directions-modal"> Directions </div>
            <button id="det-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#details-modal"> Details </div>
            <button id="abt-btn" type="button" class="btn btn-primary btn-wide" data-bs-toggle="modal" data-bs-target="#about-modal"> About </div>
            `;

    // Give the button a callback to toggle the menu
    function toggleMenu(): void {
        menu.style.display = (menu.style.display === 'grid') ? 'none' : 'grid';
    }
    btn.onclick = () => toggleMenu();

    // Create a div to contain the button and menu
    const div = document.createElement('div');
    div.appendChild(btn);
    div.appendChild(menu);

    // Click outside to close
    document.addEventListener('click', e => {
        const trg = e.target as unknown as Node;
        if (!btn.contains(trg) && !menu.contains(trg)) {
            menu.style.display = 'none';
        }
    });

    // Return the wrapper
    return div;
}

`<div>
    <button class="menu-button" onclick="toggleMenu()"><div style="margin-top: .3rem; margin-bottom: -.3rem;">☰</div></button>
    <div id="menu" class="menu-content">
        <!-- <a href="#directions-modal" id="dir-link" data-toggle="modal">Directions</a> -->
    </div>
</div>`;