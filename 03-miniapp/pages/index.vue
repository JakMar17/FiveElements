<template>
    <ClientOnly>
        <main style="height: 100%;">
            <div class="container container--primary"
                style="display: flex; align-items: center; flex-direction: column;">
                <h1 style="margin: 0">
                    PayToPlay miniapp
                </h1>
                <div style="margin-top: 0.5em; font-weight: 600;">
                    MiniApp created by <a href="https://jakob.marela.team">JakMar17</a>
                </div>
            </div>


            <div class="container" style="display: flex; align-items: stretch; flex-direction: column; gap: 2em">
                <a class="is-button" href="https://buy.stripe.com/test_3csaGfc1q2zu2v67st">20 €</a>
                <a class="is-button" href="https://buy.stripe.com/test_bIY7u38Pegqkc5GbIK">40 €</a>
                <a class="is-button" href="https://buy.stripe.com/test_3csg0zghG8XS2v628c">100 €</a>
            </div>
        </main>
    </ClientOnly>
</template>

<script lang="ts" setup>
onMounted(() => {
    const app = window.Telegram.WebApp;
    app.ready();
});
</script>