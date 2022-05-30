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
        src="assets/images/eurobowl250.png"
        alt="EuroBowl 2022 Malta logo"
        loading="lazy"
        width="250px"
        height="277px"
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
        // height: 500px;
        width: 100%;
        background-color: var(--secondary-colour);
        // background-image: url(../assets/images/flagOfMalta.svg);
    }
    .logo {
        display: block;
        margin: 0 auto;
        padding: 20px 0;
        max-width: 100%;
        @media print {
            display: none;
        }
    }
</style>
