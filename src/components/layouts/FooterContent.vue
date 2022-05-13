<template>
  <v-footer app color="#848484" class="footer">
    <span class="px-4">&copy; {{ new Date().getFullYear() }} Answering Legal</span>
    <div class="text-center footer-contact">
      <a href="#">Terms</a>
      <a href="#">About Us</a>
      <a href="#">Privacy Policy</a>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterContent',
}
</script>

<style scoped>
.footer {
  color: #DADADA !important;
}

.footer-contact {
  width: calc(100% - 200px);
}

.footer a {
  color: #DADADA !important;
  text-decoration: underline;
  padding: 16px;
}
</style>
