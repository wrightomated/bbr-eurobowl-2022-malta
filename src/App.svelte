<script lang="ts">
    import Footer from './components/footer.svelte';
    import Menu from './components/menu/menu.svelte';
    import Team from './components/team.svelte';
    import Modal from './components/uiComponents/modal.svelte';

    import Overlay from './components/uiComponents/overlay.svelte';

    let logo, y;
</script>

<svelte:window bind:scrollY={y} />

<Modal />
<Overlay />
<Menu />
<div class="img-cont">
    <img
        class="logo no-print"
        src="assets/images/eurobowl.png"
        alt="EuroBowl 2022 Malta logo"
        loading="lazy"
        width="500px"
        height="554px"
    />
</div>
<main>
    <Team />
    <Footer />
</main>

<style lang="scss">
    main {
        padding: 8px;
    }
    .img-cont {
        width: 100%;
        background-color: var(--secondary-background-colour);
        border-bottom: 2px solid var(--secondary-colour);
        @media print {
            display: none;
        }
    }
    .logo {
        display: block;
        margin: 0 auto;
        padding: 20px 0;
        max-width: 100%;
        width: 250px;
        height: auto;
        transition: width 1s, height 1s;
        @media screen and (min-width: 1000px) {
            width: 333px;
        }
        @media screen and (min-width: 1600px) {
            width: 400px;
        }
    }
</style>
