/* eslint-disable @next/next/no-img-element */

export const repo = 'https://github.com/oikoaudio/plugg';

function Screenshot({ src, alt, width, height, caption, compact = false }: { src: string; alt: string; width: number; height: number; caption: string; compact?: boolean }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/${src}`;
  return <figure className={`doc-figure screenshot-figure${compact ? ' compact-figure' : ''}`}><a href={url}><img src={url} alt={alt} width={width} height={height} loading="lazy" /></a><figcaption>{caption}</figcaption></figure>;
}

export function PluggStartContent() {
  return <>
    <p>Plugg is for musicians and producers on Linux who own Windows-only plug-ins, or want to use them. Drop in the vendor&apos;s installer or a Windows VST3, and the plug-in shows up in your DAW as a native VST3. Free and paid plug-ins go through the same steps. That includes plug-ins that install through a vendor&apos;s own manager app, and plug-ins licensed through iLok.</p>
    <h3>Why Plugg exists</h3>
    <p>With Wine and yabridge, some Windows plug-ins work right away. Others take effort. Getting iLok to work for several vendors, or running installers built on modern Windows libraries, is a nightmare.</p>
    <p>Plugg gives each vendor its own environment, so a new installer can&apos;t break one that already works. Each fix goes into that vendor&apos;s recipe or into Plugg&apos;s runtime, so the next person who drops in the same installer gets it without the detective work. A vendor that hasn&apos;t been tried yet will probably still need a fix of its own.</p>
    <h3>Bring your own installers</h3>
    <p>Plugg takes what the vendor gives you: an EXE installer, an MSI, or a Windows VST3 file or bundle. Plugg runs it in the background, in a private Windows environment, and keeps the installer.</p>
    <h3>Vendor apps and iLok</h3>
    <p>Native Access, UA Connect, Softube Central, Klevgrand Helper, Kilohearts Installer and other vendor apps open from the vendor&apos;s row in Plugg. Sign in, install your products, and close the app. Plugg then adds whatever the app installed to your DAW. iLok-licensed plug-ins share one environment with PACE License Support, and Plugg&apos;s runtime includes the Wine fixes the PACE installer needs.</p>
    <Screenshot src="plugg-ilok.png" alt="The Universal Audio row in Plugg, expanded. The UADx LA-2A Tube Compressor is in the DAW, and two more UADx plug-ins wait for iLok activation next to an Activate in iLok button." width={905} height={178} caption="An amber dot means something needs you. Here two UADx plug-ins wait for activation in iLok." />
    <h3>Protecting your activations</h3>
    <p>Plugg records which environments hold activations and refuses the operations that could cost you a seat. Every environment on a computer presents the same machine identity, so one computer counts as one machine against a vendor&apos;s limit.</p>
    <Screenshot src="plugg-delete-confirm.png" alt="Plugg's Delete environment dialog for Klevgrand. It lists the installed plug-ins and asks you to type I HAVE DEACTIVATED THIS ENVIRONMENT to confirm." width={580} height={464} caption="Deleting an environment that holds activations takes a typed confirmation." compact />
    <h3>From installer to DAW</h3>
    <ol>
      <li>Drop an installer or a VST3 on the Plugg window.</li>
      <li>Plugg sets up a Windows environment for that vendor, or reuses the one it already has.</li>
      <li>The installer runs, or the vendor&apos;s app opens so you can sign in and install your products.</li>
      <li>Plugg publishes the new plug-ins to <code>~/.vst3/plugg</code>. Rescan plug-ins in your DAW.</li>
    </ol>
  </>;
}

export function PluggFeatureContent() {
  return <>
    <section>
      <h2>What it does</h2>
      <dl className="manual-list">
        <div><dt>Native VST3s</dt><dd>Plugg publishes each plug-in where your DAW looks, in <code>~/.vst3/plugg</code>. Each keeps its original VST3 class ID, so saved projects find it again.</dd></div>
        <div><dt>Vendor apps</dt><dd>The vendor&apos;s manager or helper opens from its row. When you close it, Plugg checks what it installed and adds it to your DAW.</dd></div>
        <div><dt>One environment per vendor</dt><dd>Each vendor gets its own Windows environment. A broken installer or an update from one vendor doesn&apos;t touch another&apos;s.</dd></div>
        <div><dt>iLok and PACE</dt><dd>iLok-licensed plug-ins share one environment with PACE License Support, which iLok sees as one computer. Activate them in iLok License Manager.</dd></div>
        <div><dt>Activations</dt><dd>Plugg refuses operations that could cost you a seat. Deleting an environment that holds activations takes a typed confirmation that names what&apos;s at stake, for example &quot;I HAVE DEACTIVATED THIS ENVIRONMENT&quot;.</dd></div>
        <div><dt>One machine identity</dt><dd>Every environment on a computer presents the same machine identity, so each environment doesn&apos;t count as another machine against a vendor&apos;s limit.</dd></div>
        <div><dt>Status dots</dt><dd>Green means the vendor&apos;s plug-ins are in your DAW. Amber means something needs you, and the row has the button that does it, such as &quot;Activate in iLok&quot;. Blue means the vendor&apos;s app is running.</dd></div>
        <div><dt>Disk use</dt><dd>Plugg shows the size of each vendor and of the whole library folder. Leftovers go into a cleanup list, so nothing takes up space without you seeing it.</dd></div>
        <div><dt>Crash handling</dt><dd>If a plug-in takes its Windows host down, Plugg fails the load within seconds instead of leaving your DAW waiting.</dd></div>
        <div><dt>Keyboard and screen readers</dt><dd>Arrow keys and Enter move through the list, and typing searches. Every control has a label for screen readers. The window follows your desktop&apos;s text size and high-contrast settings.</dd></div>
      </dl>
      <Screenshot src="plugg-large-text.png" alt="Plugg's vendor list in the dark theme with larger text and high contrast." width={1120} height={1060} caption="Larger text and high contrast, following the desktop settings." />
    </section>
    <section>
      <h2>Recipes are data, not scripts</h2>
      <p>A recipe describes how to set up a vendor: the runtime, graphics settings, Microsoft components and installer arguments. It is a TOML file, never a script. Before you use a recipe you didn&apos;t write, Plugg explains it in plain language: what it can do, every download and its hash, the exact arguments any installer would get, and anything worth a second look.</p>
      <p>In the app, choose <strong>Add recipe…</strong> on the <strong>Recipes &amp; fixes</strong> page, and Plugg shows the same report before it adds the recipe.</p>
      <Screenshot src="plugg-recipe.png" alt="Plugg explaining the Native Instruments recipe: its runtime, pinned downloads with SHA-256 hashes, what it can do, and a list of points worth looking at." width={820} height={900} caption="The Native Instruments recipe, explained. Points worth a second look are flagged in colour." />
    </section>
    <section>
      <h2>Help and known fixes</h2>
      <p>Help is an FAQ in plain words. When you add an installer, Plugg says what is already known about it. That can be a tested setup, the vendor&apos;s tested notes, another project&apos;s research on the same file, or a native Linux version you should use instead.</p>
      <Screenshot src="plugg-known-fixes.png" alt="Plugg installing Native Access, with the tested notes for Native Instruments and another project's findings shown in orange below the progress line." width={1070} height={110} caption="While Native Access installs, Plugg shows what is known about Native Instruments." />
      <p><strong>Troubleshoot</strong> opens the reusable fixes for that vendor.</p>
    </section>
    <section id="licences">
      <h2>Your licences stay on your computer</h2>
      <p>Licences live where the vendor&apos;s own app puts them, inside that vendor&apos;s environment under <code>~/.local/share/plugg/environments/</code>. iLok licences stay in iLok License Manager, in the shared iLok environment. Plugg keeps no serial numbers, licence files, passwords or account details. For a protected environment it records only the product names and hashed identity values. <a href={`${repo}/blob/main/docs/licensing-safety.md`}>Licensing safety</a> has the details.</p>
      <p>Plugg goes online only to download its own parts: Proton, its Wine modules, the plug-in bridge and Microsoft components. It fetches them from a fixed list of sites and checks each one by hash. It sends nothing about you or your plug-ins anywhere. The vendor&apos;s app signs in and activates on its own, as it would on Windows.</p>
      <p>Back up <code>~/.local/share/plugg</code> with the rest of your home folder. Don&apos;t post environment folders or vendor app logs online, because they can contain your machine&apos;s identifiers or account details.</p>
    </section>
    <section>
      <h2>How it works</h2>
      <p>Plugg manages a Proton runtime: a pinned UMU-Proton build plus Plugg&apos;s own patched Wine modules, which you can rebuild byte for byte from source. Each vendor gets its own Wine prefix.</p>
      <p>A patched build of <a href="https://github.com/robbert-vdh/yabridge">yabridge</a> bridges each plug-in into the DAW. Each environment runs one long-lived session that all its plug-ins share. An earlier design used a separate container per plug-in instance, and instances stalled each other. The shared session fixed that.</p>
      <p>Plugg pins the runtime and bridge builds and checks them by hash.</p>
    </section>
    <section id="install">
      <h2>Install</h2>
      <p>Download the package for your system from <a href={`${repo}/releases/latest`}>the latest release on GitHub</a>, then install it from the folder you saved it to:</p>
      <ul>
        <li>Ubuntu 24.04 or newer, Debian 13 or newer: download the .deb, then run <code>sudo apt install ./plugg_*_amd64.deb</code>.</li>
        <li>Fedora 42 or newer: download the .rpm, then run <code>sudo dnf install ./plugg-*.x86_64.rpm</code>.</li>
      </ul>
      <p>An AUR package for Arch is coming. Until then, on Arch and Arch-based systems such as CachyOS and EndeavourOS, build the package from source:</p>
      <pre><code>{`git clone ${repo}.git
cd plugg/packaging/aur/plugg-git
makepkg -si`}</code></pre>
      <p>On other distributions, <a href={`${repo}/blob/main/docs/building.md#build-from-a-checkout`}>build from a checkout</a>.</p>
      <p>Start Plugg from your applications menu, or run <code>plugg gui</code>. It downloads its Proton runtime the first time it needs it. Then drop in an installer and point your DAW at <code>~/.vst3/plugg</code>.</p>
      <p>Plugg is a developer preview, and not every plug-in will work. See <a href="#status">Status</a> before you rely on it.</p>
    </section>
  </>;
}

export function PluggStatusContent() {
  return <>
    <p><strong>Plugg is a developer preview.</strong> It is developed and tested on one machine running CachyOS, Hyprland and Bitwig. Not every plug-in will work.</p>
    <p>Klevgrand and Variety of Sound work. Native Instruments, Plugin Alliance and Universal Audio, through iLok, are experimental. Kilohearts and other free plug-ins can be dropped in as VST3 files or installers. A vendor that hasn&apos;t been tested yet will often need a fix of its own before it works.</p>
    <p>What has been tested changes every week, so this page doesn&apos;t list products. The app tells you what is known about an installer when you add it, and <a href={`${repo}/tree/main/docs/compatibility`}>Plugg&apos;s compatibility notes</a> list what has been tested for each vendor.</p>
    <h3>iLok</h3>
    <p>iLok-licensed plug-ins work in one shared environment. Creating that environment is still a command-line step, and experimental.</p>
    <h3>Separate environments are not security sandboxes</h3>
    <p>Separate environments keep one vendor&apos;s setup away from another&apos;s. They don&apos;t protect your system from the software you install. Install plug-ins you would trust on Windows.</p>
    <h3>Other DAWs</h3>
    <p>Plugg is tested in Bitwig. REAPER, Ardour and other DAWs haven&apos;t been tested separately yet.</p>
    <h3>Plugg has no helpdesk</h3>
    <p>One person makes Plugg. Good bug reports get read and fixed. To report a bug, open Help and choose <strong>Report a bug in Plugg…</strong>. The form asks for what makes a report useful, then opens <a href={`${repo}/issues`}>GitHub&apos;s issue form</a> in your browser with a summary you can read and edit first. Nothing leaves your computer unless you submit it.</p>
    <p>I usually can&apos;t answer requests to get one particular setup working. Start with Help, the known fixes and Troubleshoot in the app.</p>
  </>;
}

export function PluggFaqContent() {
  return <dl className="manual-list faq-list">
    <div><dt>Does it work with REAPER or Ardour?</dt><dd>Not validated yet. Plugg publishes ordinary VST3 bundles in <code>~/.vst3/plugg</code>, but it has only been tested in Bitwig.</dd></div>
    <div><dt>Can I use free plug-ins?</dt><dd>Yes. Drop in the Windows VST3 file or bundle, or the installer it came with.</dd></div>
    <div><dt>What about iLok?</dt><dd>iLok-licensed plug-ins work in one shared environment with PACE License Support. Creating that environment is still a command-line step, and experimental. When a plug-in waits for activation, its row turns amber and shows <strong>Activate in iLok</strong>. Close iLok License Manager afterwards, and Plugg checks again.</dd></div>
    <div><dt>Will it use up my activations?</dt><dd>Every environment on a computer presents the same machine identity, so vendors see one machine. Plugg also refuses operations that could lose an activation. Deactivate a plug-in in the vendor&apos;s app before you delete its environment.</dd></div>
    <div><dt>Is each environment a sandbox?</dt><dd>No. Separate environments keep vendors&apos; setups apart, but they are not security sandboxes.</dd></div>
    <div><dt>Can I check a recipe before I use it?</dt><dd>Yes. Recipes are TOML files, not scripts. Plugg explains what a recipe can do, what it downloads with each hash, and anything worth a second look, before you add it.</dd></div>
    <div><dt>What happens when a plug-in crashes?</dt><dd>Plugg notices when a plug-in takes its Windows host down and fails the load within seconds, so your DAW doesn&apos;t wait forever.</dd></div>
    <div><dt>Where are my licences, and what goes online?</dt><dd>Licences stay where the vendor&apos;s app puts them, inside that vendor&apos;s environment on your computer. Plugg keeps no serial numbers, passwords or account details. It goes online only to download its own parts, each checked by hash, and sends nothing about you or your plug-ins. See <a href="#licences">Your licences stay on your computer</a>.</dd></div>
    <div><dt>Is there a Flatpak?</dt><dd>No, and none is planned. If you want a Flatpak, use <a href="https://github.com/Mark12870/cabinet">Cabinet</a>.</dd></div>
    <div><dt>Which distributions?</dt><dd>Plugg is developed on CachyOS. There are packages for Ubuntu 24.04 or newer, Debian 13 or newer and Fedora 42 or newer. An AUR package for Arch is coming; until then it builds from source on Arch-based systems. See <a href="#install">Install</a>.</dd></div>
    <div><dt>What if it doesn&apos;t work?</dt><dd>Start with Help, the known fixes Plugg shows for your installer, and Troubleshoot. Plugg has no helpdesk, but I read good bug reports. To report one, open Help and choose <strong>Report a bug in Plugg…</strong>. The form asks for what I need to reproduce the problem.</dd></div>
  </dl>;
}

export function PluggCreditsContent() {
  return <>
    <section>
      <h2>Plugg and Cabinet</h2>
      <p><a href="https://github.com/Mark12870/cabinet">Cabinet</a> is a related free project with the same basic design: one Wine prefix per vendor and a patched yabridge. It is a Flatpak, installs with one command on any distribution, including image-based ones such as Fedora Silverblue, and has a curated, tested catalogue. If you want a Flatpak, Cabinet is the one to use.</p>
    </section>
    <section>
      <h2>Credits and licence</h2>
      <p>Plugg is free software under the GPL-3.0-or-later licence. <a href={repo}>The source is on GitHub</a>. It is built on <a href="https://github.com/robbert-vdh/yabridge">yabridge</a> by Robbert van der Helm, on Wine, and on Proton and UMU.</p>
      <p>Plugg is not affiliated with Valve, Bitwig or any plug-in vendor. iLok and PACE are trademarks of their owners.</p>
    </section>
  </>;
}
