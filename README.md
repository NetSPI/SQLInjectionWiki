<a href="https://netspi.com">
    <img src="./images/logo.png" alt="NetSPI logo" title="NetSPI" align="right" height="60" />
</a>

NetSPI SQL Injection Wiki
======================

This wiki's mission is to be a one stop resource for fully identifying, exploiting, and escalating SQL injection vulnerabilities across various Database Management Systems.

## Contributing

### Structure

All DBMS content is located in the ./build directory, under the appropriate DBMS. Any basic content changes should be made in this folder. Adding a new DBMS is not currently a well abstracted process. Submit an issue for help in adding an entire new DBMS. Top level pages with no DBMS tabs can be added in the ./views directory and included in [./views/nav.html](./views/nav.html).

More detailed documentation coming soon.

### Style

Follow the styles already set in the existing files if not listed below.

- All tables should have classes of `table table-striped table-hover`
- All code snippets should be wrapped in `<code></code>`
- All top headers should be `<h3></h3>`
- All sub section headers should be `<h4 class="injectionSubheading"></h4>`
- Top level descriptions should be `<p class="readableText"></p>`
- Secondary descriptions should just be `<p></p>`

## Development environment

It is easiest to run this locally with the attached python script `runit.py`. This removes all caching and adds a fallback url, so we can use real URL paths for routing. To run just type `python runit.py` and go to [http://localhost:8000](http://localhost:8000).

## Github contributing

To make any changes please make a pull request or create an issue.

## Admin contributing

For those with write access to this repository do the following after making changes or before accepting pull requests:

Increment the minor VERSION variable near the bottom of [./index.html](./index.html#L77). This helps push the new changes even if they're cached.

```bash
git pull
git add .
git commit -am "[commit_message_here]"
git push origin master
```

That will update the master repository.

## Contributors

- Aaron Yaeger
- Antti Rantasaari
- Ben Tindell
- Colin Salisbury
- Eric Gruber (@egru)
- Jake Reynolds (@jreynoldsdev)
- Kai Tran (@k_tr4n)
- Rafael Seferyan
- Scott Sutherland (@_nullbind)
