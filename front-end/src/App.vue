<script lang="ts" setup>
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
        title: "Classes",
        meta: [
                {
                        name: "Classes",
                        content: ""
                },
                {
                        name: "theme-color",
                        content: () => (isDark.value ? "#00aba9" : "#ffffff")
                }
        ],
        link: [
                {
                        rel: "icon",
                        type: "image/x-icon",
                        href: "/Favicons/favicon.ico"
                },
                {
                        rel: "icon",
                        type: "image/png",
                        sizes: "32x32",
                        href: "/Favicons/favicon-32x32.png"
                },
                {
                        rel: "icon",
                        type: "image/png",
                        sizes: "16x16",
                        href: "/Favicons/favicon-16x16.png"
                },
                {
                        rel: "apple-touch-icon",
                        sizes: "180x180",
                        href: "/Favicons/apple-touch-icon.png"
                }
        ]
});
</script>

<template>
	<RouterView />
</template>

<style></style>
