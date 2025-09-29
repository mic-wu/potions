<template>
  <nav>
    <span>
      <RouterLink to="/">home</RouterLink> / {{ $route.fullPath.slice(1) }}
    </span>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  padding: 16px;
  width: 100%;
  position: fixed;
}
</style>